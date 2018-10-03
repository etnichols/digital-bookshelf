const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Context, getUserId, APP_SECRET } = require('./utils')

const resolvers = {
  Query: {
    user(parent, { id }, ctx, info) {
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
    bookshelves(parent, args, ctx, info) {
      return ctx.db.query.bookshelves()
    }
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
    async createAccount(parent, { firstName, lastName, email, password }, ctx, info) {
      const hashedPassword = await bcrypt.hash(password, 10)

      // Pass in the fields to query on the returned shelf, by default it will
      // only be scalar. So we need to explicitly tell the mutation which
      // fields we're interested in to the "info" argument.
      const bookshelf = await ctx.db.mutation.createBookshelf({
        data: {
          owner: {
            create: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hashedPassword
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

      return {
        token: jwt.sign({ userId: bookshelf.owner.id }, APP_SECRET),
        user: bookshelf.owner,
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

      const bookshelves = await
        ctx.db.query.bookshelves({ where: { owner: {id: user.id} }})

      if(!bookshelves.length){
        throw new Error('No bookshelf for user')
      }

      return {
        token: jwt.sign({ userId: user.id }, APP_SECRET),
        user: user,
        bookshelfId: bookshelves[0].id
      }
    },
  },
}

const PRISMA = 'https://eu1.prisma.sh/public-junglepig-932/digital-bookshelf/dev'

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
