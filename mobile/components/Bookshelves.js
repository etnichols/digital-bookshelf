// TODO: Renders a list of Bookshelves.
import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import Bookshelf from './Bookshelf'
import BookIcon from './icons/BookshelfIcon'
import BookshelfLedge from './BookshelfLedge'
import CreateBookshelfModal from './CreateBookshelfModal'
import SelectedBook from './SelectedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export class Bookshelves extends React.Component {
  constructor(props){
    super(props)
    this._displayModal = this._displayModal.bind(this)
    this.state = {
      modalVisible: false,
      bookshelves: null,
    }
  }

  _displayModal(){
    this.setState({
      modalVisible: true,
    })
  }

  static navigationOptions = {
    tabBarLabel: 'Your Shelves',
  }

  render(){
    return (
      <Query query={BOOKSHELVES_BY_USER_QUERY}>
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
          return (
            // TODO: Make bookshelves collapsible.
            <View style={CommonStyles.container}>
              <Text style={CommonStyles.screenTitle}>Your Bookshelves</Text>
              <FlatList
                ref={ref => this.flatList = ref}
                data={bookshelves}
                keyExtractor={(item, index) => item.id}
                renderItem={ ({ item, index }) => {
                  return (<Bookshelf item={item} index={index}/>)
                }}
              />
              <TouchableHighlight
                style={CommonStyles.button}
                onPress={this._displayModal}>
                <Text style={CommonStyles.buttonText}>Create new Bookshelf</Text>
              </TouchableHighlight>
              <CreateBookshelfModal
                modalVisible={this.state.modalVisible}
                callback={ () => { this.setState({ modalVisible: false }) }}
              />
            </View>)
            }
          }
      </Query>)
    }
}

export const BOOKSHELVES_BY_USER_QUERY = gql`
  query BookshelvesQuery {
    bookshelvesByUser {
      shelves {
        id
        name
        owner {
          id
        }
        books {
          id
          author
          title
          isbn
          description
        }
      }
    }
  }`
