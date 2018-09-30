import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import LoginForm from './LoginForm'

import { CommonStyles, BLUE_HEX, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Launch extends React.Component {

  static navigationOptions = {
      header: null
    }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Digital Bookshelf</Text>
        <LoginForm navigation={this.props.navigation}/>
        <Text style={CommonStyles.commonText}>New here?</Text>
        <TouchableHighlight
          title="Create an Account"
          onPress={() => this.props.navigation.navigate('CreateAccount')}>
          <Text style={styles.createAccountButtonText}>Create an Account</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingBottom: 100,
    fontFamily: OXYGEN_MONO_REGULAR,
    fontSize: 32,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 50,
    padding: 10,
  },
  createAccountButtonText: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 16,
    padding: 10,
    color: BLUE_HEX,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})

// <TouchableHighlight
//   style={CommonStyles.button}
//   title="Login"
//   onPress={() => this.props.navigation.navigate('Login')}>
//   <Text style={CommonStyles.buttonText}>Login</Text>
// </TouchableHighlight>
