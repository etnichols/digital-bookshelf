import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Profile extends React.Component {
  render(){
    return (
      <View style={CommonStyles.container}>
        <Text>This is a profile page.</Text>
      </View>
    )
  }
}
