import { Font } from 'expo'
import React from 'react'
import { ApolloProvider, withApollo } from 'react-apollo'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import { AppRegistry, AsyncStorage, StyleSheet, Text, View } from 'react-native'

import RootStack from './components/RootStack'
import { getApolloClient } from './utils/getApolloClient'

import { CommonStyles } from './components/CommonStyles'

export default class App extends React.Component {
  constructor() {
    super()
    this._apolloClient = getApolloClient()
    this.state = {
      fontLoaded: false,
    }
  }

  async componentWillMount() {
    // Testing: uncomment to reset hardware storage
    // await AsyncStorage.removeItem('dbtoken')

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
        <ApolloProvider client={this._apolloClient}>
        { this.state.fontLoaded ?
          ( <RootStack /> ) :
          ( <Text>Loading...</Text> )
        }
        </ApolloProvider>
       )
    }
}
