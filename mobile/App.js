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
import LaunchScreen from './components/LaunchScreen'
import Login from './components/Login'
import Profile from './components/Profile'

// import 'typeface-oxygen'
// import 'typeface-oxygen-mono'

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

const RootStack = createStackNavigator({
  Launch: LaunchScreen,
  Login: Login,
  CreateAccount: CreateAccount,
  Profile: Profile
},{})

export default class App extends React.Component {

  constructor() {
    super()
    this.state =
    {
      fontLoaded: false,
    }
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
    if(this.state.fontLoaded){
      return (
      <ApolloProvider client={client}>
        <RootStack />
      </ApolloProvider> )
    } else
    {
      return(
        <View>Loading</View>
      )
    }
  }
}
