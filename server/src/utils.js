const jwt = require('jsonwebtoken')
const { Prisma } = require('prisma-binding')

// TODO: Make this an env variable. DO NOT DEPLOY WITH THIS.
const APP_SECRET = 'secret'

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    console.log('geetUserId: ' + userId)
    return userId
  }
  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}

module.exports = {
  getUserId,
  AuthError,
  APP_SECRET,
}
