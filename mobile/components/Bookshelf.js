import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { StyleSheet, Text, View } from 'react-native';

class Bookshelf extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>This is the bookshelf view.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Bookshelf
