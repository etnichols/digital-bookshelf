import { Font } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'

// https://github.com/react-navigation/react-navigation/issues/1690
const LOCAL_HOST = `http://192.168.0.8:4000`

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

const getApolloClient = () => {
  const client = new ApolloClient({
    link: asyncAuthLink.concat(httpLink),
    cache: new InMemoryCache()
  })
  return client
}

export default function ApolloWrapper(CMP){
  return class WrappedApp extends React.Component {
    constructor() {
      super()
      this.state =
      {
        fontLoaded: false,
      }

      this.client = getApolloClient()

      console.log('got client! ' + JSON.stringify(this.client))
    }

    async componentWillMount() {
      await Font.loadAsync({
          'Oxygen-Bold': require('./assets/fonts/Oxygen-Bold.ttf'),
          'Oxygen-Light': require('./assets/fonts/Oxygen-Light.ttf'),
          'Oxygen-Regular': require('./assets/fonts/Oxygen-Regular.ttf'),
          'OxygenMono-Regular': require('./assets/fonts/OxygenMono-Regular.ttf')
        })

        this.setState({
          fontLoaded: true
        })
      }

    render() {
        return (
        <ApolloProvider client={this.client}>
          { this.state.fontLoaded ? ( <CMP /> ) : ( <Text>Loading</Text> ) }
        </ApolloProvider>
         )
      }
  }
}
