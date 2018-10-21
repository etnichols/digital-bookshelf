const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Context, getUserId, APP_SECRET } = require('./utils')

const resolvers = {
  Query: {
    user: (parent, { id }, ctx, info) => {
      return ctx.db.query.user({ where: { id: id } }, info)
    },
    me(parent, args, ctx, info) {
      const userId = getUserId(ctx)
      return ctx.db.query.user({ where: { id: userId } }, info)
    },
    users(parent, args, ctx, info) {
      return ctx.db.query.users()
    },
    book(parent, { isbn }, ctx, info) {
      return ctx.db.query.book({ where: { isbn: isbn } }, info)
    },
    books(parent, args, ctx, info) {
      return ctx.db.query.books()
    },
    async bookshelf(parent, { id }, ctx, info) {
      const bookshelf = await ctx.db.query.bookshelf({ where: { id: id } }, `
        {
          id
          owner {
            id
          }
          books {
            id
            author
            title
            isbn
            description
          }
        }
        `)

      console.log('bookshelf: ' + JSON.stringify(bookshelf))

      // `getUserId` throws an error if the requesting user is not authenticated
      const userId = getUserId(ctx)

      if(bookshelf.owner.id === userId){
        return bookshelf
      }

      throw new Error(
       'Invalid permissions, you must be an owner or follower of a bookshelf to access it.',
      )
    },
    async bookshelves(parent, { userId }, ctx, info) {
      console.log('bookshelves id: ' + userId)
      return ctx.db.query.bookshelves({ where: { owner: { id: userId } } }, `{
        id
        title
        owner {
          firstName
          lastName
        }
        books {
          isbn
          title
        }
      }`)
    },
  },
  Mutation: {
    async addBooksToShelf(parent, { books, bookshelfId }, ctx, info){
      // Split into create and connect.
      let createBooks = []
      let connectBooks = []

      // An async forEach implementation.
      const asyncForEach = async (array, callback) => {
        for(let i = 0; i < array.length; i++){
          await callback(array[i], i, array)
        }
      }

      const processBooks = async books => {
        await asyncForEach(books, async book => {
          if(await ctx.db.exists.Book({ isbn: book.isbn })) {
            connectBooks.push({
              isbn: book.isbn
            })
          } else {
            createBooks.push({
              isbn: book.isbn,
              title: book.title,
              author: book.author,
              description: book.description
            })
          }
        })
      }

      await processBooks(books.books)

      return ctx.db.mutation.updateBookshelf({
          data: {
            books: {
              create: createBooks,
              connect: connectBooks
            }
          },
          where: {
            id: bookshelfId
          }
        }, `{
        id
        owner {
          id
          email
        }
        books {
          author
          id
          isbn
          title
        }
      }`)
    },
    async removeBookFromShelf(parent, { bookshelfId, isbn }, ctx, info){
      console.log('removing book from shelf')
      // updating the bookshelf.
      return ctx.db.mutation.updateBookshelf({
        data: {
          books: {
            disconnect: [{ isbn: isbn }]
          }
        },
        where: {
          id: bookshelfId
        }
      }, info)
    },

    async confirmAccount(parent, { confirmationCode }, ctx, info) {
      const userId = getUserId(ctx)
      console.log('\n\n\nuserId: ' + userId+ '\n\n\n\n')

      // You provided an invalid selector...
      const user = await ctx.db.query.user({ where: { id: userId } }, `{
        id
        confirmationCode
      }`)

      if(!user){
        throw new Error('Bad token, no user found.')
      }

      console.log('conf code real: ' + user.confirmationCode)
      console.log('conf code submitted: ' + confirmationCode)

      if(confirmationCode !== user.confirmationCode){
        throw new Error('Wrong confirmation code.')
      }

      // Make user's first shelf.
      const bookshelf = await ctx.db.mutation.createBookshelf({
        data: {
          name: 'Your First Shelf',
          owner: {
            connect: {
              id: user.id
            }
          }
        }
      }, `{
        id
        owner {
          id
          email
        }
        books {
          author
          id
          isbn
          title
        }
      }`)

      // And update their account.
      await ctx.db.mutation.updateUser({
        data: {
          isConfirmed: true,
        },
        where: {
          id: userId
        }
      }, info)

      // Return a login payload.
      return {
        user: user,
        bookshelfIds: [bookshelf.id]
      }
    },
    async createAccount(parent,
      { firstName,
        lastName,
        username,
        phoneNumber,
        password },
        ctx, info) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await ctx.db.mutation.createUser({
        data: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          phoneNumber: phoneNumber,
          password: hashedPassword,
          confirmationCode: '1234',
          isConfirmed: false,
        }
      }, `{
        id
      }`)

      console.log('created Account user: ' + JSON.stringify(user))

      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET)
      }
    },
    deleteUser(parent, { id }, ctx, info) {
      return ctx.db.mutation.deleteUser({ where: { id: id } }, info)
    },
    async login(parent, { userOrPhone, password }, ctx, info) {
      let user

      let userInfo = `{
        password
        phoneNumber
        id
        isConfirmed
      }`

      if(isNaN(userOrPhone)){
        // It's a username.
        user = await ctx.db.query.user({ where: { username: userOrPhone} } , userInfo)
      } else {
        // It's a phone number.
        // TODO: Validate it's a valid phone number.
        user = await ctx.db.query.user({ where: { phoneNumber: userOrPhone } }, userInfo )
      }

      console.log('User: ' + JSON.stringify(user))

      if(!user){
        throw new Error(`No user found for ${userOrPhone}.`)
      }

      if(!user.isConfirmed){
        throw new Error(`Account not yet activated.`)
      }

      const valid = await bcrypt.compare(password, user.password)

      if(!valid){
        throw new Error('Invalid password')
      }

      const bookshelves = await
        ctx.db.query.bookshelves({ where: { owner: {id: user.id } } },`{
          id
        }`)

      if(!bookshelves.length){
        throw new Error('No bookshelf for user')
      }

      // TODO: Return ALL the users shelf IDs. Not just one.
      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET),
        user: user,
        bookshelfIds: []
      }
    },
  },
}

const PRISMA = 'https://eu1.prisma.sh/public-junglepig-932/digital-bookshelf/dev'

// TODO: Understand this server construction better.
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
      endpoint: PRISMA, // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
    }),
  }),
})

server.start(() =>
  console.log('Server is running on http://localhost:4000'))
