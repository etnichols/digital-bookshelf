import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Svg, { Path } from 'react-native-svg'

import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR } from './CommonStyles'

export default class ScannedBook extends React.Component {
  _cleanTitle(title){
    // Truncate the Title if needed.
    let cleanTitle
    if(title.length > 35){
      cleanTitle = title.split('').slice(0,30)
      // If we managed to truncate with last character as space, remove it.
      if(cleanTitle[cleanTitle.length-1] === ' '){
        cleanTitle.pop()
      }
      cleanTitle = cleanTitle.concat(['.','.','.']).join('')
    } else {
      cleanTitle = title
    }
    return cleanTitle
  }

  render(){
    const { item } = this.props
    console.log('Scanned book item!: ' + JSON.stringify(item))
    return (
      <View style={styles.scannedBookContainer}>

        <View style={styles.scannedBookInfo}>
          <Text style={styles.scannedBookTitle}>
            {this._cleanTitle(item.title)}
          </Text>
          <Text style={styles.scannedBookAuthor}>
            {item.author}
          </Text>
        </View>

        <View>
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
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    borderColor: '#008B8B',
    borderWidth: 2,
    borderRadius: 5,
  },
  scannedBookInfo: {
    flex: 1,
  },
  scannedBookTitle: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
  },
  scannedBookAuthor: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
  }
})
