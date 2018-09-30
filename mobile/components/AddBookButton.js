import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { CommonStyles, BOOK_COLOR_HEX, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class AddBookButton extends React.Component {
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
          <View style={styles.book}>
            <Text style={styles.addText}>{`Add one or many Books`}</Text>
            <Text style={styles.addIcon}>{`+`}</Text>
          </View>
        </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  addIcon: {
    flexWrap: 'wrap',
    fontFamily: OXYGEN_MONO_REGULAR,
    color: BOOK_COLOR_HEX,
    fontSize: 36,
    paddingBottom: 5,
  },
  addText: {
    fontFamily: OXYGEN_BOLD,
    color: BOOK_COLOR_HEX,
    fontSize: 18,
    paddingBottom: 20,
  },
  book: {
    height: 250,
    width: 150,
    borderColor: BOOK_COLOR_HEX,
    backgroundColor: 'rgba(256,256,256,0.3)',
    borderWidth: 2,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
})
