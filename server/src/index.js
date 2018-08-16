const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Context, getUserId, APP_SECRET } = require('./utils')

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info)
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info)
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id: id } }, info)
    },
    user(parent, { id }, ctx, info) {
      return ctx.db.query.user({ where: { id: id } }, info)
    },
    users(parent, args, ctx, info) {
      return ctx.db.query.users()
    },
    bookshelf(parent, { id }, ctx, info) {
      return ctx.db.query.bookshelves({ where: { id: id } }, info)
    }
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text,
          },
        },
        info,
      )
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id: id } }, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id: id },
          data: { isPublished: true },
        },
        info,
      )
    },
    async createUser(parent, { firstName, lastName, email, password }, ctx, info) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await ctx.db.mutation.createUser({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword
        }
      })

      // TEST: Just seeding everyone's library with a single book.
      const seedbooks = await ctx.db.query.books()

      console.log('!!!' + seedbooks)

      // const seedConnect = seedbooks

      const bookshelf = await ctx.db.mutation.createBookshelf({
        data: {
          owner: {
            connect: {
              id: user.id
            }
          },
          books: {
            connect: null
          }
        }
      })

      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET),
        user: user,
        bookshelf: bookshelf
      }
    },
    deleteUser(parent, { id }, ctx, info) {
      return ctx.db.mutation.deleteUser({ where: { id: id } }, info)
    },
    async login(parent, { email, password }, ctx, info) {

      const user = await ctx.db.query.user({ where: { email: email } } );
      if(!user){
        throw new Error(`No user found for email: ${email}`)
      }

      const valid = await bcrypt.compare(password, user.password)
      if(!valid){
        throw new Error('Invalid password')
      }

      const bookshelf = await ctx.db.query.bookshelf({ where: { owner: user }})

      if(!bookshelf){
        throw new Error('No bookshelf for user')
      }

      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET),
        user: user,
        bookshelf: bookshelf
      }
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
      endpoint: 'https://eu1.prisma.sh/public-junglepig-932/digital-bookshelf/dev', // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
