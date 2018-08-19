import React from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View } from 'react-native';

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'

import Bookshelf from './components/Bookshelf'
import CreateAccount from './components/CreateAccount'
import Entry from './components/Entry'
import Login from './components/Login'

// https://www.prisma.io/forum/t/using-apollo-boost-in-react-native-with-prisma-graphql-api/2961
const LOCAL_HOST = `http://192.168.0.8:4000`

const httpLink = createHttpLink({
  uri: LOCAL_HOST
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from session storage if it exists.
  const token = null // localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router sceneStyle={styles.container}>
          <Scene key={'root'}>
            <Scene key={'entry'} component={Entry} initial={true} />
            <Scene key={'bookshelf'} path='/bookshelf/:id/' component={Bookshelf} />
            <Scene key={'signup'} path='/signup/' component={CreateAccount} />
            <Scene key={'login'} path='/login/' component={Login} />
          </Scene>
        </Router>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
