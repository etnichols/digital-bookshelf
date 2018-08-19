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
  book: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    borderWidth: 1,
  },
});

export default Book
