import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Button, Text, View, ViewPropTypes } from 'react-native';
import { Actions } from 'react-native-router-flux';

class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: PropTypes.object,
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>HELLO THERE</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
    // borderWidth: 2,
    // borderColor: 'red',
  },
})

export default DrawerContent
