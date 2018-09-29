import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookModal from './AddBookModal'
import Book from './Book'
import BookshelfLedge from './BookshelfLedge'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelf extends React.Component {
  constructor(){
    super()

    this._hideModal = this._hideModal.bind(this)
    this._handleBookSelected = this._handleBookSelected.bind(this)

    this.state = {
      modalVisible: false,
      selectedBook: null,
      index: null,
    }
  }

  _createBookshelf(books){
    if(!books.length){
      return (
        <Text style={styles.emptyShelfText}>
          {`Your shelf is empty. Add some books!`}
        </Text> )
    }
    const selectedIndex = this.state.index
    return(
      <FlatList
        horizontal
        ref={ref => this.flatList = ref}
        data={books}
        keyExtractor={(item, index) => item.isbn}
        extraData={this.state}
        renderItem={ ({ item, index }) =>
          <Book
            item={item}
            index={index}
            isSelected={false}
            onPressItem={this._handleBookSelected}
            /> }
      /> )
  }

  _handleBookSelected(book, index){
    this.setState({
      index: index,
      selectedBook: book,
    }, () => {
      this.flatList.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
       })
    })
  }

  _renderSelectedBook(book){
    if(book){
      return (
        <View style={styles.selectedBookContainer}>
          <Text style={styles.selectedBookTitle}>{book.title}</Text>
          <Text style={styles.selectedBookDescription}>{book.description}</Text>
        </View>
      )
    }
  }

  _hideModal() {
    this.setState({
      modalVisible: false,
    })
  }

  static navigationOptions = {
      title: 'Your Bookshelf',
      headerLeft: null
    }

  render(){
    const bookshelfId = this.props.navigation.getParam('bookshelfId', 1);
    // const bookshelfId = `cjmmqs07n0cgb0b68h8lnusra`
    const { selectedBook } = this.state

    return (
      <Query query={BOOKSHELF_QUERY} variables={{id: bookshelfId}}>
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
            <ScrollView contentContainerstyle={CommonStyles.container}>
              <View style={styles.shelfContainer}>
                {this._createBookshelf(data.bookshelf.books)}
              </View>
              <BookshelfLedge />
              <AddBookModal
                bookshelfId={bookshelfId}
                modalVisible={this.state.modalVisible}
                callback={() => {
                  this.setState({
                    modalVisible: false,
                  }, () =>{
                    refetch()
                  })
                }}
                />

              {this._renderSelectedBook(selectedBook)}

              <TouchableHighlight
                style={CommonStyles.button}
                onPress={ () => {
                  this.setState({
                    modalVisible: true
                  })
                }} >
                <Text style={CommonStyles.buttonText}>{'Add Books'}</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={CommonStyles.button}
                onPress={ async () => {
                  await AsyncStorage.removeItem('dbtoken')
                  this.props.navigation.navigate('Launch')
                }} >
                <Text style={CommonStyles.buttonText}>{'Logout'}</Text>
              </TouchableHighlight>
            </ScrollView> )
        }
      }
      </Query>
    )
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
    marginTop: 50,
  },
  selectedBookContainer: {
    flex: 1,
    alignItems: 'stretch',
    padding: 20
  },
  selectedBookTitle: {
    alignSelf: 'center',
    fontFamily: OXYGEN_BOLD,
    fontSize: 18,
    margin: 5,
  },
  selectedBookDescription: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
    margin: 5,
    lineHeight: 22,
    alignSelf: 'center'
  }
})

const BOOKSHELF_QUERY = gql`
  query BookshelfQuery($id: ID!) {
    bookshelf(id: $id) {
      books {
        author
        title
        isbn
        description
      }
    }
  }
`

// getItemLayout={(data, index) => ({length: Dimensions.get('window').width / 5, offset: Dimensions.get('window').width / 5 * index, index})}
