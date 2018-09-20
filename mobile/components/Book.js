import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Book extends React.Component {
  render(){
    return (
      <View style={styles.book}>
        <Text style={styles.bookTitle}>{`${this.props.data.title}`}</Text>
        <Text style={styles.bookAuthor}>{`Sally Author`}</Text>
        <Text style={styles.bookIsbn}>{`114144414414`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bookTitle: {
    flexWrap: 'wrap',
    fontFamily: 'Oxygen-Bold',
    color: '#fff',
    fontSize: 24,
    paddingBottom: 5,
  },
  bookAuthor: {
    fontFamily: 'Oxygen-Regular',
    color: '#fff',
  },
  bookIsbn: {
    fontFamily: 'Oxygen-Regular',
    color: '#fff',
  },
  book: {
    height: 200,
    backgroundColor: '#22556E',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
  }
});

export default Book
