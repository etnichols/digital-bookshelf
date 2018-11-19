import gql from 'graphql-tag'
import React from 'react';
import { Query } from 'react-apollo'
import { AsyncStorage, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import { CommonStyles, BLUE_HEX, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

/**
* TODO: Actually make this a Discover Page.
*
* - Search functionality on all publicly available shelves.
* - Follow a shelf you like.
*/
export default class Discover extends React.Component {

  static navigationOptions = {
    title: 'Discover',
    tabBarLabel: 'Discover',
  }

  render() {
    return (
      <Query query={PROFILE_QUERY}>
      { ( { data, loading, error, refetch } ) => {
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
          <View style={CommonStyles.container}>
            <Text style={CommonStyles.screenTitle}>
              One day this will have cool search functionality.
            </Text>
          </View> )
      }}
      </Query>
    )
  }
}

const styles = StyleSheet.create({
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
