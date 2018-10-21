// TODO: Renders a list of Bookshelves.
import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import Bookshelf from './Bookshelf'
import BookIcon from './icons/BookshelfIcon'
import BookshelfLedge from './BookshelfLedge'
import SelectedBook from './SelectedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelves extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      bookshelves: null,
    }
  }

  static navigationOptions = {
    tabBarLabel: 'Your Shelves',
  }

  render(){
    return (
      <Query query={BOOKSHELVES_QUERY}>
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
            return (
            <View style={CommonStyles.container}>
              <Text style={CommonStyles.loadingText}>
                {`${error}`}
              </Text>
            </View> )
          }
          const bookshelves = data.bookshelvesByUser.shelves
          console.log('bookshelves: ' + JSON.stringify(bookshelves))
          return (
            <ScrollView contentContainerstyle={CommonStyles.container}>
              <FlatList
                ref={ref => this.flatList = ref}
                data={bookshelves}
                keyExtractor={(item, index) => item.id}
                renderItem={ ({ item, index }) => {
                    return (<Bookshelf item={item} index={index}/>)
                          }
                        }
                 />
              </ScrollView>)
            }
          }
        </Query>)
      }
}

const styles = StyleSheet.create({
  emptyShelfText: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: OXYGEN_MONO_REGULAR,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  shelfContainer: {
    flex: 1,
    marginTop: 20,
  }
})

const BOOKSHELVES_QUERY = gql`
  query BookshelvesQuery {
    bookshelvesByUser {
      shelves {
          id
          name
          books {
            author
            title
            isbn
            description
          }
      }
    }
  }`
