const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { Query } = require('./resolvers/Query')
const { Mutation } = require('./resolvers/Mutation')

const resolvers = {
  Query,
  Mutation
}

// const PRISMA = 'https://eu1.prisma.sh/public-junglepig-932/digital-bookshelf/dev'
const PRISMA = 'http://192.168.1.229:4466/digital-bookshelf/dev'

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
