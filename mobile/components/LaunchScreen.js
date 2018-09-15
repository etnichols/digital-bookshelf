import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import commonstyles from './commonstyles'

class LaunchScreen extends React.Component {

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    fontFamily: 'Oxygen-Regular'
  },
});

export default LaunchScreen
