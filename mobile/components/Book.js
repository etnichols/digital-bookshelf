import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class Book extends React.Component {
  render(){
    return (
      <View style={styles.book}>
        <Text style={styles.bookTitle}>{`${this.props.data.title}`}</Text>
        <Text style={styles.bookAuthor}>{`${this.props.data.author}`}</Text>
        <Text style={styles.bookIsbn}>{`${this.props.data.isbn}`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bookTitle: {
    flexWrap: 'wrap',
    fontFamily: 'Oxygen-Bold',
    color: '#fff',
    fontSize: 18,
    paddingBottom: 5,
  },
  bookAuthor: {
    fontFamily: 'Oxygen-Regular',
    color: '#fff',
    fontSize: 14,
  },
  bookIsbn: {
    fontFamily: 'Oxygen-Regular',
    color: '#fff',
  },
  book: {
    height: 200,
    backgroundColor: '#22556E',
    padding: 20,
    marginHorizontal: 40,
    marginVertical: 10,
    borderRadius: 5,
  }
})
