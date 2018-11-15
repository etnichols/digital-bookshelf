import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookButton from './AddBookButton'
import AddBookModal from './AddBookModal'
import Book from './Book'
import BookIcon from './icons/BookshelfIcon'
import BookshelfLedge from './BookshelfLedge'
import SelectedBook from './SelectedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR, BLUE_HEX } from './CommonStyles'

export default class Bookshelf extends React.Component {
  constructor(props){
    super(props)
    this._hideModal = this._hideModal.bind(this)
    this._displayModal = this._displayModal.bind(this)
    this._handleBookSelected = this._handleBookSelected.bind(this)
    this._handleBookDeleted = this._handleBookDeleted.bind(this)
    this._toggleShelfVisibility = this._toggleShelfVisibility.bind(this)
    this.state = {
      shelfVisible: false,
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

  static navigationOptions = {
    tabBarLabel: 'Bookshelves',
    headerStyle: {
      backgroundColor: '#008B8B',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }

  render(){
    const { selectedBook, shelfVisible } = this.state
    const books = this.props.item.books
    const bookshelfId = this.props.item.id
    return (
      <View>
        <View style={styles.titleAndToggle}>
          <Text style={styles.shelfName}>{this.props.item.name}</Text>
          <TouchableHighlight
            style={styles.toggleButton}
            onPress={this._toggleShelfVisibility}>
            <Text style={styles.buttonText}>Toggle</Text>
          </TouchableHighlight>
        </View>
        { shelfVisible &&
          <View>
          <View style={styles.shelfContainer}>
            {this._createBookshelf(this.props.item.books)}
          </View>
          <BookshelfLedge />
          <AddBookModal
            bookshelfId={bookshelfId}
            modalVisible={this.state.modalVisible}
            callback={() => {
              this.setState({
                modalVisible: false,
              })
            }}
          />
          <SelectedBook
            book={selectedBook}
            bookshelfId={bookshelfId}
            onDeleteCallback={() => {
              this.setState({
                selectedBook: null,
                index: null
              }) }}
          />
          </View>
        }
      </View>)
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
    flex: 1,
    alignSelf: 'stretch',
  },
  titleAndToggle: {
    padding: 5,
    flexDirection: 'row',
    backgroundColor: BLUE_HEX,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shelfName: {
    fontFamily: OXYGEN_MONO_REGULAR,
    fontSize: 24,
    marginLeft: 20,
    color: '#fff',
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
    color: '#fff',
    fontSize: 12,
    alignSelf: 'center',
  },
})
