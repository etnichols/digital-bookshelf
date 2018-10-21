const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { Context, getUserId, APP_SECRET } = require('../utils')

const Mutation = {
  addBooksToShelf: async (parent, { books, bookshelfId }, ctx, info) => {
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
  removeBookFromShelf: async (parent, { bookshelfId, isbn }, ctx, info) => {
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
  confirmAccount: async (parent, { confirmationCode }, ctx, info) => {
    const userId = getUserId(ctx)
    const user = await ctx.db.query.user({ where: { id: userId } }, `{
      id
      confirmationCode
    }`)

    if(!user){
      throw new Error('Bad token, no user found.')
    }

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
  createAccount: async (parent,
    { firstName,
      lastName,
      username,
      phoneNumber,
      password },
      ctx, info) => {
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
    }, `{ id }`)

    return {
      token: jwt.sign({ userId: user.id }, APP_SECRET)
    }
  },
  deleteUser: (parent, { id }, ctx, info) => {
    return ctx.db.mutation.deleteUser({ where: { id: id } }, info)
  },
  login: async (parent, { userOrPhone, password }, ctx, info) => {
    let user
    let userInfo = `{
      password
      phoneNumber
      id
      isConfirmed
    }`

    if(isNaN(userOrPhone)){
      console.log('username.')
      // It's a username.
      user = await ctx.db.query.user({ where: { username: userOrPhone} } , userInfo)
    } else {
      console.log('phone number.');
      // It's a phone number.
      // TODO: Actually validate it's a valid phone number.
      user = await ctx.db.query.user({ where: { phoneNumber: userOrPhone } }, userInfo )
    }

    if(!user){
      throw new Error(`No user found for ${userOrPhone}.`)
    }

    // if(!user.isConfirmed){
    //   console.log('user not confirmed...')
    //   return {
    //     user: { isConfirmed: user.isConfirmed }
    //   }
    // }

    const valid = await bcrypt.compare(password, user.password)
    if(!valid){
      throw new Error('Invalid password')
    }

    return {
      token: jwt.sign({ userId: user.id }, APP_SECRET),
      user: {
        isConfirmed: user.isConfirmed
      }
    }
  },
}

module.exports = {
  Mutation,
}
