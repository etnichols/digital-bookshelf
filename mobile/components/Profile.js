import gql from 'graphql-tag'
import React from 'react';
import { Query } from 'react-apollo'
import { AsyncStorage, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { CommonStyles, BLUE_HEX, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    drawerLabel: 'Profile',
  }

  renderProfile(user){
    return (
      <View style={styles.profileContainer}>
      <View style={styles.profilePicture}></View>
        <Text style={styles.profileTitle}>
          {`${user.firstName} ${user.lastName}`}
        </Text>
        <Text style={styles.profileBody}>
          {`${user.username}`}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Query query={PROFILE_QUERY}>
      { ( { data, loading, error, refetch } ) => {
        console.log('Profile error: ' + JSON.stringify(error, null, 2))
        console.log('Profile data: ' + JSON.stringify(data, null, 2))

        if(loading){
          return (
            <View style={CommonStyles.container}>
              <Text style={CommonStyles.loadingText}>
                Loading...
              </Text>
            </View> )
        }

        if(error){
          return (
          <View style={CommonStyles.container}>
            <Text style={CommonStyles.loadingText}>
              {`${error}`}
            </Text>
          </View> )
        }

        return(
          <View style={styles.container}>
          <Text style={CommonStyles.screenTitle}>Your Profile</Text>
          { this.renderProfile(data.me) }
            <TouchableHighlight
              style={CommonStyles.button}
              onPress={ async () => {
                await AsyncStorage.removeItem('dbtoken')
                this.props.navigation.navigate('Launch')
              }} >
              <Text style={CommonStyles.buttonText}>Logout</Text>
            </TouchableHighlight>
          </View>
        )
      }}
      </Query>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  profilePicture: {
    alignSelf: 'center',
    padding: 20,
    width: 100,
    height: 100,
    backgroundColor: BLUE_HEX
  },
  profileContainer: {
    flex: 1,
    alignItems: 'stretch',
    padding: 20,
  },
  profileTitle: {
    alignSelf: 'center',
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
    margin: 5,
  },
  profileBody: {
    alignSelf: 'center',
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
    margin: 5,
  },
})

const PROFILE_QUERY = gql`
  query ProfileQuery {
    me {
      firstName
      lastName
      username
    }
  }
`
