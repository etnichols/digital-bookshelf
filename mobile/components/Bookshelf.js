import  gql from 'graphql-tag'
import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookButton from './AddBookButton'
import AddBookModal from './AddBookModal'
import Book from './Book'
import BookshelfLedge from './BookshelfLedge'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelf extends React.Component {
  constructor(props){
    super(props)

    // This default value is a hack to always load 'p' user shelf for testing.
    this._bookshelfId = props.navigation.getParam('bookshelfId', 'cjmmqs07n0cgb0b68h8lnusra');

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

    // if(!books.length){
    //   return (
    //     <Text style={styles.emptyShelfText}>
    //       {`Your shelf is empty. Add some books!`}
    //     </Text> )
    // }

    return(
      <FlatList
        horizontal
        ref={ref => this.flatList = ref}
        data={booksWithAddButton}
        keyExtractor={(item, index) => item.isbn}
        extraData={this.state}
        renderItem={ ({ item, index }) => {
          if(item.isButton === true){
            console.log('rendering addbooks button')
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
    title: 'Your Bookshelf'
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

              {this._renderSelectedBook(selectedBook, refetch)}

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
    marginTop: 20,
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
  },
  deleteButtonText: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
    padding: 5,
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 200,
    borderRadius: 30,
    borderColor: 'red',
    borderWidth: 1,
    paddingHorizontal: 40,
    paddingVertical: 6,
    alignSelf: 'center',
    marginTop: 10
  },
})

const REMOVE_BOOK_MUTATION = gql`
  mutation RemoveBookFromShelfMutation(
    $bookshelfId: ID!,
    $isbn: String! ) {
      removeBookFromShelf(
        bookshelfId: $bookshelfId,
        isbn: $isbn ) {
          id
        }
    }`

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
