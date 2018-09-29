import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

export default class Book extends React.Component {
  constructor(props){
    super(props)
    this._onPress = this._onPress.bind(this)
  }
  _onPress(){
    console.log('pressed book fuck yeah')
    this.props.onPressItem(this.props.item);
  }

  render(){
    return (
        <TouchableHighlight onPress={this._onPress}>
          <View style={styles.book}>
            <Text style={styles.bookTitle}>{`${this.props.item.title}`}</Text>
            <Text style={styles.bookAuthor}>{`${this.props.item.author}`}</Text>
            <Text style={styles.bookIsbn}>{`${this.props.item.isbn}`}</Text>
          </View>
        </TouchableHighlight>
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
    height: 250,
    width: 150,
    backgroundColor: '#22556E',
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
  }
})
