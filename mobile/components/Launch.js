import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import commonstyles from './commonstyles'

class Launch extends React.Component {

  render(){
    return (
      <View style={commonstyles.container}>
        <Text style={commonstyles.header}>Digital Bookshelf</Text>
        <View style={commonstyles.loginContainer}>
        <TouchableHighlight
          style={commonstyles.button}
          title="Login"
          onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={commonstyles.buttonText}>Login</Text>
        </TouchableHighlight>
        <Text>Or</Text>
        <TouchableHighlight
          style={commonstyles.button}
          title="Create an Account"
          onPress={() => this.props.navigation.navigate('CreateAccount')}>
          <Text style={commonstyles.buttonText}>Create Account</Text>
        </TouchableHighlight>
        </View>
      </View>
    )
  }
}

export default Launch
