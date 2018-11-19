import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { CommonStyles } from './CommonStyles'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    await AsyncStorage.setItem('dbtoken', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjam9uajdyNWZnb2Y3MDkxMTNseXg5eDMzIiwiaWF0IjoxNTQyNTk4NzM3fQ.DUJmua7CclHufPievZzVX2QRUSn-diNuP5OyhA2UiMs`)
    // await AsyncStorage.removeItem('dbtoken')
    const userToken = await AsyncStorage.getItem('dbtoken');
    console.log('userToken: ' + userToken)

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(
      userToken ? 'App' : 'Auth',
      userToken ? {
        token: userToken
      } : null);
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={CommonStyles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
