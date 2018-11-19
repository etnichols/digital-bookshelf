const { Context, getUserId, APP_SECRET } = require('../utils')

const Query = {
  user: (parent, { id }, ctx, info) => {
    return ctx.db.query.user({ where: { id: id } }, info)
  },
  me: async (parent, args , ctx, info) => {
    const userId = getUserId(ctx)
    const user = ctx.db.query.user({ where: { id: userId } }, info)
    console.log('me query got user: '+ JSON.stringify(user))
    return user
  },
  users: (parent, args, ctx, info) => {
    return ctx.db.query.users()
  },
  book: (parent, { isbn }, ctx, info) => {
    return ctx.db.query.book({ where: { isbn: isbn } }, info)
  },
  books: (parent, args, ctx, info) => {
    return ctx.db.query.books()
  },
  bookshelf: async (parent, { id }, ctx, info) => {
    const bookshelf = await ctx.db.query.bookshelf({ where: { id: id } }, `
      {
        id
        name
        owner {
          id
          username
        }
        books {
          id
          author
          title
          isbn
          description
        }
      }`)
    const userId = getUserId(ctx)

    // TODO: Eventually add support for followers.
    if(bookshelf.owner.id === userId){
      return bookshelf
    }

    throw new Error(
     'Invalid permissions, you must be an owner or follower of a bookshelf to access it.',
    )
  },
  bookshelvesByUser: async (parent, args, ctx, info) => {
    const userId = getUserId(ctx)
    const shelves = await ctx.db.query.bookshelves({ where: { owner: { id: userId } } }, `{
      id
      name
      owner {
        id
        firstName
        lastName
      }
      books {
        author
        isbn
        title
        description
      }
    }`)
    return {
      shelves: shelves
    }
  },
}

module.exports = {
  Query,
}
