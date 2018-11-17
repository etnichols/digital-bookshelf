import React from 'react'
import Svg, { Path } from 'react-native-svg'
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
          <View style={[CommonStyles.book, styles.scale]}>
            <Text style={styles.addText}>{`Add more Books`}</Text>
            <View style={styles.plusIcon}>
              <Svg height="50" width="50" viewBox="0 0 25 25">
                <Path
                  fill="#fff"
                  d="M13.5,3.188C7.805,3.188,3.188,7.805,3.188,13.5S7.805,23.813,13.5,23.813S23.813,19.195,23.813,13.5 S19.195,3.188,13.5,3.188z M19,15h-4v4h-3v-4H8v-3h4V8h3v4h4V15z"
                />
              </Svg>
            </View>
          </View>
        </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  addIcon: {
    flexWrap: 'wrap',
    fontFamily: OXYGEN_MONO_REGULAR,
    color: '#fff',
    fontSize: 18,
    paddingBottom: 5,
  },
  addText: {
    fontFamily: OXYGEN_BOLD,
    color: '#fff',
    fontSize: 14,
    paddingBottom: 10,
    textAlign: 'center',
  },
  scale: {
    height: Math.floor(250/1.5),
    width: Math.floor(150/1.5)
  },
  plusIcon:{
    flex: 1,
    alignSelf: 'center',
  }
})
