import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

import { CommonStyles, BOOK_COLOR_HEX, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR, WHITE } from './CommonStyles'

export class Book extends React.Component {
  constructor(props){
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress(){
    this.props.onPressItem(this.props.item, this.props.index);
  }

  render(){
    return (
        <TouchableHighlight onPress={this._onPress}>
          <View style={CommonStyles.book}>
            <Text style={styles.bookTitle}>{`${this.props.item.title}`}</Text>
            <Text style={styles.bookAuthor}>{`${this.props.item.author}`}</Text>
          </View>
        </TouchableHighlight>
    )
  }
}

export class AddBookButton extends React.Component {
  constructor(props){
    super(props)
    this._onPress = this._onPress.bind(this)
  }

  _onPress(){
    this.props.onPressItem();
  }

  render(){
    return (
        <TouchableHighlight onPress={this._onPress}>
          <View style={CommonStyles.book}>
            <Text style={[styles.bookTitle, styles.addBooksText]}>{`Add more Books`}</Text>
            <Icon
              name="circle-with-plus"
              size={50}
              color={WHITE}
              style={styles.plusIcon} />
          </View>
        </TouchableHighlight> )
  }
}

const styles = StyleSheet.create({
  bookTitle: {
    flexWrap: 'wrap',
    fontFamily: OXYGEN_BOLD,
    color: '#fff',
    fontSize: 18,
    paddingBottom: 5,
  },
  addBooksText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  bookAuthor: {
    fontFamily: OXYGEN_REGULAR,
    color: '#fff',
    fontSize: 14,
  },
  bookIsbn: {
    fontFamily: OXYGEN_REGULAR,
    color: '#fff',
  },
  plusIcon:{
    flex: 1,
    alignSelf: 'center',
  }
})
