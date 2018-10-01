import React from 'react';
import { AsyncStorage, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { CommonStyles } from './CommonStyles'

export default class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    drawerLabel: 'Profile',
  }

  render(){
    return (
      <View style={CommonStyles.container}>
        <Text style={CommonStyles.screenTitle}>This is a profile page.</Text>
        <TouchableHighlight
          style={CommonStyles.button}
          onPress={ async () => {
            await AsyncStorage.removeItem('dbtoken')
            this.props.navigation.navigate('Launch')
          }} >
          <Text style={CommonStyles.buttonText}>{'Logout'}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
