import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Book extends React.Component {
  render(){
    return (
      <View style={styles.book}>
        <Text>{`Title: ${this.props.data.title}`}</Text>
        <Text>{`ISBN: ${this.props.data.isbn}`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    fontFamily: 'OxygenMono-Regular',
    fontSize: 18,
  },
  book: {
    height: 80,
    width: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 40,
    marginVertical: 20,
  }
});

export default Book
