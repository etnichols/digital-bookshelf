import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Profile extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>This is a profile page.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Profile
