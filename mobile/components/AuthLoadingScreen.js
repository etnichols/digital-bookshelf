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
    await AsyncStorage.removeItem('dbtoken')
    const userToken = await AsyncStorage.getItem('dbtoken');

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
