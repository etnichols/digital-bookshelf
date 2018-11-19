// TODO: Renders a list of Bookshelves.
import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

import BookshelfDetail from './BookshelfDetail'
import BookIcon from './icons/BookshelfIcon'
import BookshelfLedge from './BookshelfLedge'
import CreateBookshelfModal from './CreateBookshelfModal'
import SelectedBook from './SelectedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR, BLUE_HEX, WHITE, OFF_WHITE } from './CommonStyles'

export class BookshelfList extends React.Component {
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
    title: 'Your Bookshelves',
    tabBarLabel: 'Bookshelves',
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
            <View style={styles.container}>
              <FlatList
                ref={ref => this.flatList = ref}
                data={bookshelves}
                keyExtractor={(item, index) => item.id}
                renderItem={ ({ item, index }) => {
                  return (
                      <TouchableHighlight onPress={() => {
                        this.props.navigation.navigate('BookshelfDetail', {
                          bookshelfId: item.id,
                          bookshelfName: item.name
                        })
                      }}>
                        <View style={styles.shelfItem}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Icon
                            style={styles.icon}
                            name="chevron-thin-right"
                            size={30}
                            color={BLUE_HEX} />
                        </View>
                      </TouchableHighlight> )
                }}
              />
              <CreateBookshelfModal
                modalVisible={this.state.modalVisible}
                callback={ () => { this.setState({ modalVisible: false }) }}
              />
              <TouchableHighlight
                onPress={this._displayModal}
                style={CommonStyles.button} >
                <Text style={CommonStyles.buttonText}>
                  Create new Shelf
                </Text>
              </TouchableHighlight>
            </View> )
        }}
      </Query>)
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
  shelfItem: {
    backgroundColor: OFF_WHITE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: 0.2,
  },
  itemName: {
    color: BLUE_HEX,
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
    padding: 20,
  },
  icon: {
    paddingRight: 10
  }
})

export const BOOKSHELVES_BY_USER_QUERY = gql`
  query BookshelvesQuery {
    bookshelvesByUser {
      shelves {
        id
        name
        owner {
          id
        }
      }
    }
  }`
