import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'

import AddBookModal from './AddBookModal'
import { AddBookButton, Book } from './Book'
import BookIcon from './icons/BookshelfIcon'
import BookshelfLedge from './BookshelfLedge'
import SelectedBook from './SelectedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR, BLUE_HEX } from './CommonStyles'

export default class BookshelfDetail extends React.Component {
  constructor(props){
    super(props)

    this._hideModal = this._hideModal.bind(this)
    this._displayModal = this._displayModal.bind(this)
    this._handleBookSelected = this._handleBookSelected.bind(this)
    this._handleBookDeleted = this._handleBookDeleted.bind(this)
    this._toggleShelfVisibility = this._toggleShelfVisibility.bind(this)

    this._bookshelfId = this.props.navigation.getParam('bookshelfId')
    this._bookshelfName = this.props.navigation.getParam('bookshelfId')

    this.state = {
      modalVisible: false,
      selectedBook: null,
      index: null,
    }
  }

  _hideModal() {
    this.setState({
      modalVisible: false,
    })
  }

  _displayModal(){
    this.setState({
      modalVisible: true,
    })
  }

  _handleBookSelected(book, index){
    this.setState({
      index: index,
      selectedBook: book,
      modalVisible: false,
    }, () => {
      this.flatList.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
       })
    })
  }

  _handleBookDeleted(){
    this.setState({
      selectedBook: null,
      index: null,
    })
  }

  _toggleShelfVisibility(){
    let curVis = this.state.shelfVisible
    this.setState({
      shelfVisible: !curVis
    })
  }

  _createBookshelf(books){
    const booksWithAddButton = books.concat([{
      isButton: true,
      isbn: 'notABookAButton'
    }])

    return (
      <FlatList
        horizontal
        ref={ref => this.flatList = ref}
        data={booksWithAddButton}
        keyExtractor={(item, index) => item.isbn}
        extraData={this.state}
        renderItem={ ({ item, index }) => {
          if(item.isButton === true){
            return ( <AddBookButton onPressItem={this._displayModal}/> )
          }
          return (
            <Book
              item={item}
              index={index}
              isSelected={false}
              onPressItem={this._handleBookSelected}
              onDeleteCallback={this._handleBookDeleted}
            /> )
          }}
      />)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.bookshelfName,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#008B8B',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }

  render() {
    const { selectedBook } = this.state
    return (
      <Query
        query={BOOKSHELF_BY_USER_QUERY}
        variables={{id: this._bookshelfId}}
      >
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

        return (
          <View style={CommonStyles.container}>
            <View style={styles.shelfContainer}>
              {this._createBookshelf(data.bookshelf.books)}
            </View>
            <BookshelfLedge />
            <SelectedBook
              book={selectedBook}
              bookshelfId={this._bookshelfId}
              onDeleteCallback={() => {
                this.setState({
                  selectedBook: null,
                  index: null
                })
              }}
            />
            <AddBookModal
              bookshelfId={this._bookshelfId}
              modalVisible={this.state.modalVisible}
              callback={() => {
                this.setState({
                  modalVisible: false,
                })
              }}
            />
          </View>
        )
      }}
      </Query> )
  }
}

const styles = StyleSheet.create({
  emptyShelfText: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: OXYGEN_MONO_REGULAR,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  shelfContainer: {
    marginBottom: 10,
  },
  titleAndToggle: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shelfName: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 24,
    marginLeft: 20,
    color: BLUE_HEX,
  },
  toggleButton: {
    alignSelf: 'flex-end',
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 5,
    margin: 5,
  },
  buttonText: {
    fontFamily: OXYGEN_REGULAR,
    color: BLUE_HEX,
    fontSize: 12,
    alignSelf: 'center',
  },
})

export const BOOKSHELF_BY_USER_QUERY = gql`
  query Bookshelf($id: ID!) {
    bookshelf(id: $id) {
        id
        name
        owner {
          username
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
    }`
