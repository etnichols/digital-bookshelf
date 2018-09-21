import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { CommonStyles } from './CommonStyles'

export default class Launch extends React.Component {

  static navigationOptions = {
      header: null
    }

  render(){
    return (
      <View style={CommonStyles.container}>
        <Text style={CommonStyles.header}>Digital Bookshelf</Text>
        <View style={CommonStyles.loginContainer}>
        <TouchableHighlight
          style={CommonStyles.button}
          title="Login"
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={CommonStyles.buttonText}>Login</Text>
        </TouchableHighlight>
        <Text>Or</Text>
        <TouchableHighlight
          style={CommonStyles.button}
          title="Create an Account"
          onPress={() => this.props.navigation.navigate('CreateAccount')}>
          <Text style={CommonStyles.buttonText}>Create Account</Text>
        </TouchableHighlight>
        </View>
      </View>
    )
  }
}
