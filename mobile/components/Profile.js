import gql from 'graphql-tag'
import React from 'react';
import { Query } from 'react-apollo'
import { AsyncStorage, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

import { CommonStyles, BLUE_HEX, WHITE, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Profile extends React.Component {
  static navigationOptions = ({navigation}) => {
    console.log('nav options! : ' + JSON.stringify(navigation))
    let routeTitle = 'Profile'
    if(navigation.state.params){
      routeTitle = navigation.state.params.title
    }
    return {
      title: routeTitle
    }
  }

  async componentWillMount() {
    const username = await AsyncStorage.getItem('username')
    if(username){
      this.props.navigation.setParams({title: username})
    }
  }

  render() {
    return (
      <Query query={PROFILE_QUERY}>
      { ( { data, loading, error, refetch } ) => {
        if(loading){
          return (
            <View style={CommonStyles.container}>
              <Text style={CommonStyles.loadingText}>
                Loading...
              </Text>
            </View> )
        }

        if(error){
          console.log('Profile error: ' + JSON.stringify(error))
          return (
          <View style={CommonStyles.container}>
            <Text style={CommonStyles.loadingText}>
              {`${error}`}
            </Text>
          </View> )
        }

        const { profile } = data
        const { firstName, lastName, username } = profile.user

        // this.props.navigation.setParams({title: username})

        return(
          <View style={CommonStyles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profilePicture}>
              <Icon name='user' size={50} color={WHITE} />
            </View>
            <Text style={styles.profileTitle}>
              {`${firstName} ${lastName}`}
            </Text>
            <Text style={styles.profileBody}>
              {username}
            </Text>
            <View style={styles.statsBar}>
              <View style={styles.statsItem}>
                <Text style={styles.statsItemValue}>
                  {profile.totalPersonalShelves}
                </Text>
                <Text style={styles.statsItemText}>
                  Personal Shelves
                </Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsItemValue}>
                  {profile.totalFollowingShelves}
                </Text>
                <Text style={styles.statsItemText}>
                  Following
                </Text>
              </View>
              <View style={styles.statsItem}>
                <Text style={styles.statsItemValue}>
                  {profile.totalBooksRead}
                </Text>
                <Text style={styles.statsItemText}>
                  Total Books Read
                </Text>
              </View>
            </View>
          </View>

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
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-between',
    paddingVertical: 10,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center'
  },
  statsItemValue: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
  },
  statsItemText: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 12,
  },
  profilePicture: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: BLUE_HEX
  },
  profileContainer: {
    flex: 1,
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
    profile {
      user {
        firstName
        lastName
        username
        createdAt
      }
      totalPersonalShelves
      totalFollowingShelves
      totalBooksRead
    }
  }
`
