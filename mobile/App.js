import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { Font } from 'expo'
import React from 'react'
import { ApolloProvider, withApollo } from 'react-apollo'
import { createStackNavigator } from 'react-navigation'
import { AppRegistry, AsyncStorage, StyleSheet, Text, View } from 'react-native'

import { CommonStyles } from './components/CommonStyles'

import Bookshelf from './components/Bookshelf'
import CreateAccount from './components/CreateAccount'
import Launch from './components/Launch'
import Login from './components/Login'
import Profile from './components/Profile'

const LOCAL_HOST = `http://192.168.0.4:4000`
// const LOCAL_HOST = `http://localhost:4000`

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

const RootStack = createStackNavigator({
  Bookshelf: {
    screen: Bookshelf
  },
  Launch: {
    screen: Launch
   },
  Login: {
    screen: Login
   },
  CreateAccount: {
    screen: CreateAccount
   },
  Profile: {
    screen: Profile
  }
},{
  initialRouteName: 'Launch',
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#008B8B',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  },
})

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      fontLoaded: false,
    }
    this.client = getApolloClient()
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
        { this.state.fontLoaded ?
          ( <RootStack /> ) :
          ( <Text>Loading...</Text> )
        }
        </ApolloProvider>
       )
    }
}
