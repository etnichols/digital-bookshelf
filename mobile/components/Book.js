import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Book extends React.Component {
  render(){
    return (
      <View style={styles.book}>
        <Text style={styles.bookTitle}>{`Title: ${this.props.data.title}`}</Text>
        <Text stlye={styles.bookInfo}>{`ISBN: ${this.props.data.isbn}`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bookTitle: {
    fontFamily: 'Oxygen-Regular',
    color: '#008B8B',
    fontSize: 18,
    paddingBottom: 5,
  },
  bookInfo: {
    fontFamily: 'Oxygen-Regular',
  },
  book: {
    height: 80,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    padding: 20,
    marginHorizontal: 40,
    marginVertical: 20,
  }
});

export default Book
