import React from 'react';
import { Actions} from 'react-native-router-flux';
import { StyleSheet, Text, View, Button } from 'react-native';

class Entry extends React.Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>Digital Bookshelf</Text>
        <Button title="Go to Login" onPress={() => Actions.login()} />
        <Text>Or</Text>
        <Button title="Create an Account" onPress={() => Actions.signup()} />
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

export default Entry
