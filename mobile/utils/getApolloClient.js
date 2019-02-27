import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { AsyncStorage } from 'react-native'

const LOCAL_HOST = `http://192.168.0.3:4000`

const httpLink = createHttpLink({
  uri: LOCAL_HOST
})

const asyncAuthLink = setContext( async (_, { headers } ) => {
  try {
    const token = await AsyncStorage.getItem('dbtoken')
    if(headers){
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : '',
        }
      }
    } else {
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    }
  }
  catch(e){
    console.log('error fetching token from AsyncStorage: ' + e)
  }
})

exports.getApolloClient = () => {
  const client = new ApolloClient({
    addTypename: true,
    link: asyncAuthLink.concat(httpLink),
    // https://www.apollographql.com/docs/react/advanced/caching.html#normalization
    cache: new InMemoryCache({
      dataIdFromObject: object => object.id || null
    })
  })
  return client
}
