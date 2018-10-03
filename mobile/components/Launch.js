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
          <Text style={CommonStyles.callToActionText}>Create an Account</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 80,
    fontFamily: OXYGEN_MONO_REGULAR,
    fontSize: 32,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
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
