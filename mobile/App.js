import React from 'react';
import { Actions, Drawer, Lightbox, Modal, Overlay, Router, Scene, Stack  } from 'react-native-router-flux';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';

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
import Profile from './components/Profile'
import DrawerContent from './components/DrawerContent'

// https://www.prisma.io/forum/t/using-apollo-boost-in-react-native-with-prisma-graphql-api/2961
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

const client = new ApolloClient({
  link: asyncAuthLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router sceneStyle={styles.container}>
          <Modal>
            <Scene hideNavBar key={'root'}>
              <Scene
                key='entry'
                title='Entry Page'
                component={Entry}
                initial={true}
              />
              <Scene
                title='Your Bookshelf'
                key='bookshelf'
                path='/bookshelf/'
                component={Bookshelf}
              />
            </Scene>
            <Scene
              key='signup'
              path='/signup/'
              title='Create Account'
              backTitle='Cancel'
              component={CreateAccount}
            />
            <Scene
              key='login'
              path='/login/'
              title='Login'
              backTitle='Cancel'
              component={Login} />
          </Modal>
        </Router>
      </ApolloProvider> );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
