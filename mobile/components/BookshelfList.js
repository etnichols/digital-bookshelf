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
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR, LIGHT_GREEN_HEX, BLUE_HEX, WHITE, OFF_WHITE } from './CommonStyles'

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

          const bookshelves = data.bookshelvesByUser.shelves.concat([{id: 'no', isButton: true}])

          return (
            <View style={styles.container}>
              <FlatList
                ref={ref => this.flatList = ref}
                data={bookshelves}
                keyExtractor={(item, index) => item.id}
                renderItem={ ({ item, index }) => {
                  return (
                      <TouchableHighlight onPress={item.isButton ? this._displayModal : () => {
                        this.props.navigation.navigate('BookshelfDetail', {
                          bookshelfId: item.id,
                          bookshelfName: item.name
                        })
                      }}>
                        <View style={item.isButton ? styles.buttonItem : styles.shelfItem}>
                          <Text style={item.isButton ? styles.buttonText : styles.itemName}>
                            {item.isButton ? 'Create new Shelf' : item.name}
                          </Text>
                          <Icon
                            style={styles.icon}
                            name={item.isButton ?
                              'circle-with-plus' : 'chevron-thin-right'}
                            size={30}
                            color={item.isButton ? OFF_WHITE : BLUE_HEX} />
                        </View>
                      </TouchableHighlight> )
                }}
              />
              <CreateBookshelfModal
                modalVisible={this.state.modalVisible}
                callback={ () => { this.setState({ modalVisible: false }) }}
              />
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
  buttonItem: {
    backgroundColor: BLUE_HEX,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1},
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: OFF_WHITE,
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
    padding: 20,
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
