import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Svg, { Path } from 'react-native-svg'

import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR } from './CommonStyles'

export default class ScannedBook extends React.Component {
  _cleanTitle(title){
    // Truncate the Title if needed
    let cleanTitle
    if(title.length > 35){
      console.log('title > 35: ' + title.length)
      cleanTitle = title.split('').slice(0,30).concat(['.','.','.']).join('')
    } else {
      console.log('title < 35: ' + title.length)
      cleanTitle = title
    }
    return cleanTitle
  }

  render(){
    return (
      <View style={styles.scannedBookContainer}>
        <View style={styles.scannedBook}>
          <Text style={styles.scannedBookTitle}>
            {this._cleanTitle(this.props.item.title)}
          </Text>
          <Text style={styles.scannedBookAuthor}>
            {this.props.item.author}
          </Text>
        </View>
        <View style={styles.scannedBookRemoveIcon}>
          <TouchableHighlight
            onPress={ e =>  this.props.removeBook(this.props.item.isbn) }
          >
          <Svg viewBox="0 0 40 40" height="40" width="40">
            <Path
              d="M 10,10 L 30,30 M 30,10 L 10,30"
              fill="none"
              stroke="red"
              strokeWidth="2"
            />
          </Svg>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scannedBookContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    borderColor: '#008B8B',
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'space-between'
  },
  scannedBook: {
  },
  scannedBookTitle: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
  },
  scannedBookAuthor: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14
  },
  scannedBookRemoveIcon: {
  }
})
