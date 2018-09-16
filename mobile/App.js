import { Font } from 'expo';
import React from 'react';
import { createStackNavigator } from 'react-navigation'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'

import Bookshelf from './components/Bookshelf'
import CreateAccount from './components/CreateAccount'
import Launch from './components/Launch'
import Login from './components/Login'
import Profile from './components/Profile'
// import ApolloWrapper from './ApolloWrapper'

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
})

export default class App extends React.Component {
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

    // { this.state.fontLoaded ? ( <RootStack {...this.props}/> ) : ( <Text>Loading</Text> ) }


  render() {
      return (
      <ApolloProvider client={this.client}>
        <RootStack />
        </ApolloProvider>
       )
    }
}
