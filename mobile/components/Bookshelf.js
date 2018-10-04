import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookButton from './AddBookButton'
import AddBookModal from './AddBookModal'
import Book from './Book'
import SelectedBook from './SelectedBook'
import BookshelfLedge from './BookshelfLedge'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelf extends React.Component {
  constructor(props){
    super(props)

    this._bookshelfId = props.navigation.getParam('bookshelfId', 1);
    // this._bookshelfId = `cjmsh4r0k1o3y0b38n4q9degd`
    this._hideModal = this._hideModal.bind(this)
    this._displayModal = this._displayModal.bind(this)
    this._handleBookSelected = this._handleBookSelected.bind(this)

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

  _renderSelectedBook(book, refetch){
    if(book){
      return (
        <Mutation mutation={REMOVE_BOOK_MUTATION} >
        { (removeBookMutation, {data, loading, error}) => {
          return (
            <View style={styles.selectedBookContainer}>
              <Text style={styles.selectedBookTitle}>{book.title}</Text>
              <Text style={styles.selectedBookDescription}>{book.description}</Text>
              <TouchableHighlight style={styles.deleteButton} onPress={ async e => {
                try {
                  const response = await removeBookMutation({
                    variables: {
                      bookshelfId: this._bookshelfId,
                      isbn: book.isbn
                    }
                  })
                  console.log('remove book success, refetching...')
                  this.setState({
                    selectedBook: null,
                    index: null
                  }, refetch)
                  // Do some stuff to respond to the deletion
                } catch(e){
                  console.log('error removing book from shelf: ' + e)
                }
              }}>
              <Text style={styles.deleteButtonText}>Delete Book</Text>
              </TouchableHighlight>
            </View> )
          }}
        </Mutation>
      )
    }
  }

  _createBookshelf(books){
    const booksWithAddButton = books.concat([{
      isButton: true,
      isbn: 'notABookAButton'
    }])

    return(
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
          return ( <Book
            item={item}
            index={index}
            isSelected={false}
            onPressItem={this._handleBookSelected}
            /> )
          }}
      />)
  }

  static navigationOptions = {
    title: 'Bookshelves',
    drawerLabel: 'Bookshelves',
    headerStyle: {
      backgroundColor: '#008B8B',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }

  render(){
    const { selectedBook } = this.state

    return (
      <Query query={BOOKSHELF_QUERY} variables={{id: this._bookshelfId}}>
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
            <Text style={CommonStyles.screenTitle}>Bookshelves</Text>
              <View style={styles.shelfContainer}>
                {this._createBookshelf(data.bookshelf.books)}
              </View>
              <BookshelfLedge />
              <AddBookModal
                bookshelfId={this._bookshelfId}
                modalVisible={this.state.modalVisible}
                callback={() => {
                  this.setState({
                    modalVisible: false,
                  }, () =>{
                    refetch()
                  })
                }}
                />
                <SelectedBook
                  book={selectedBook}
                  bookshelfId={this._bookshelfId}
                  onDeleteCallback={() => {
                    this.setState({
                      selectedBook: null,
                      index: null
                    }, refetch)
                  }}
                />
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
    marginTop: 20,
  }
})

const BOOKSHELF_QUERY = gql`
  query BookshelfQuery($id: ID!) {
    bookshelf(id: $id) {
      books {
        status
        book {
          author
          title
          isbn
          description
        }
      }
    }
  }
`
