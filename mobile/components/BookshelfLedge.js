import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class BookshelfLedge extends React.Component {
  render(){
    return (
      <View style={styles.ledgeContainer}>
        <View style={styles.top} />
        <View style={styles.supportsContainer}>
          <View style={styles.support} />
          <View style={styles.support} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  ledgeContainer: {
    flex: 1,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: 0.2,
    marginBottom: 5,
  },
  top: {
    marginHorizontal: 10,
    backgroundColor: '#A86355',
    alignSelf: 'stretch',
    height: 10,
    borderRadius: 3,
  },
  supportsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  support: {
    height: 40,
    marginHorizontal: 40,
    marginTop: -10,
    backgroundColor: '#A86355',
    width: 10,
    borderRadius: 3,
  }
})
