import { Constants, BarCodeScanner, Permissions } from 'expo'
import  gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { Alert, AsyncStorage, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View  } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import t from 'tcomb-form-native'

import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR } from './CommonStyles'

let Form = t.form.Form
let Book = t.struct({
  title: t.String,
  isbn: t.String
})

const ISBN_NOT_RECOGNIZED_ERROR_MESSAGE = 'ISBN not recognized :('
const BOOK_ALREADY_SCANNED_ERROR_MESSAGE = 'Book already scanned in this session.'
const ERROR_MESSAGE_DISPLAY_LENGTH_MS = 3000

export default class AddBookModal extends React.Component {
  constructor(props){
    super(props)
    this._displayError = this._displayError.bind(this)
    this._hideModal = this._hideModal.bind(this)
    this._fetchBookOrDisplayError = this._fetchBookOrDisplayError.bind(this)
    this._onBarCodeRead = this._onBarCodeRead.bind(this)
    this._requestCameraPermission = this._requestCameraPermission.bind(this)

    this.state = {
          errorMessage: null,
          hasCameraPermission: null,
          hasError: false,
          modalVisible: false,
          response: '',
          scannedBooks: [],
          scannerDisabled: false,
      }
  }

  componentDidMount() {
    this._requestCameraPermission()
  }

  componentWillReceiveProps(props){
    if(props.modalVisible){
      this.setState({
        modalVisible: props.modalVisible
      })
    }
  }

  /**
   * Hides modal and resets scanned books.
   */
  _hideModal(){
    this.setState({
      modalVisible: false,
      scannedBooks: []
    })
  }

  /**
   * Display an error in the modal using a timeout.
   */
  _displayError(msg){
    this.setState({
      hasError: true,
      errorMessage: msg,
      scannerDisabled: true
    }, () => {
      setTimeout(() => {
        this.setState({
          hasError: false,
          errorMessage: null,
          scannerDisabled: false
        })
      }, ERROR_MESSAGE_DISPLAY_LENGTH_MS)
    })
  }

  _constructQueryString(isbn){
    return `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDsbGjdoQdTMPfP7q7WubHV21NKdrjTLtA`
  }

  //TODO: Render the Close button SVG and attach onClick handler to it.
  _renderScannedBook({ item }){
    return (
      <View style={styles.scannedBookContainer}>
        <View style={styles.scannedBook}>
          <Text style={styles.scannedBookTitle}>
            {item.title}
          </Text>
          <Text style={styles.scannedBookAuthor}>
            {item.author}
          </Text>
        </View>
        <View style={styles.scannedBookRemoveIcon}>
          <Svg height="30" width="30">
            <Path
            d="M 10,10 L 30,30 M 30,10 L 10,30"
            fill="none"
            stroke="red"
            strokeWidth="2"
            />
          </Svg>
        </View>
      </View> )
  }

  _removeBook(book){
    //TODO: a function to remove the book from the scanned book array.
  }

  async _requestCameraPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted',
    })
  }

  /**
   * Handles recognition of a book barcode by processing and adding the book
   * to the current scannedBooks state variable.
   */
  async _onBarCodeRead(data) {
     const book = await this._fetchBookOrDisplayError(data)
     if(book){
       let curBooks = this.state.scannedBooks
       curBooks.push(book)
       this.setState({
         scannedBooks: curBooks,
         scannerDisabled: true
       }, () => {
         setTimeout(() => {
           this.setState({
             scannerDisabled: false,
           })
         }, ERROR_MESSAGE_DISPLAY_LENGTH_MS)
       })
     }
  }

  /**
   * Fetch a book from a database. If the supplied book has already been
   * scanned during this session, or the book cannot be found via the Google
   * Books API, display an error to the user. Else, return a constructed
   * Book object compatible with the addBooksMutation.
   */
  async _fetchBookOrDisplayError(data) {
    const isbn = data.data
    let scannedBooks = this.state.scannedBooks

    if(scannedBooks.filter(book => book.isbn === isbn).length > 0){
      this._displayError(BOOK_ALREADY_SCANNED_ERROR_MESSAGE)
      return null
    }

    try {
      const response = await fetch(this._constructQueryString(isbn), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()

      if(json.totalItems < 1){
        this._displayError(ISBN_NOT_RECOGNIZED_ERROR_MESSAGE)
          return null
        }

        const volume = json.items[0]
        const title = volume.volumeInfo.title
        // TODO: Support multiple authors.
        const author = volume.volumeInfo.authors[0]

        return {
          author: author,
          title: title,
          isbn: isbn
        }
      } catch(e) {
      console.log('e: ' + e)
    }
  }

  render(){
    const {
      errorMessage,
      hasError,
      modalVisible,
      response,
      scannedBooks,
      scannerDisabled
     } = this.state

     console.log('scanned books! -> ' + scannedBooks)

     const { bookshelfId } = this.props

    return (
      <Mutation mutation={ADD_BOOKS_MUTATION} >
      { (addBooksMutation, { data, loading, error }) => {
        return (
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
              >
              <View style={styles.modalContainer}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>
                    Scan a Book Barcode.
                  </Text>
                </View>
                { this.state.hasCameraPermission === null ?
                  <Text>Requesting for camera permission</Text> :
                    this.state.hasCameraPermission === false ?
                      <Text>Camera permission is not granted</Text> :
                      <BarCodeScanner
                        style={styles.camera}
                        onBarCodeRead={scannerDisabled ? null : this._onBarCodeRead}
                      /> }
                  { hasError &&
                    <Text style={CommonStyles.errorText}>{errorMessage}</Text> }

                    <FlatList
                      data={scannedBooks}
                      keyExtractor={(item, index) => item.isbn}
                      extraData={this.state}
                      renderItem={this._renderScannedBook}
                    />

                  <TouchableHighlight
                    disabled={scannedBooks.length > 0 ? false : true}
                    style={scannedBooks.length > 0 ?
                      CommonStyles.button : CommonStyles.disabledButton }
                    onPress={async () => {
                      console.log('adding ' + this.state.scannedBooks.length + ' books')
                        try {
                          const response = await addBooksMutation({
                            variables: {
                              bookshelfId: bookshelfId,
                              books: { books: scannedBooks }
                            }
                          })
                          this._hideModal()
                          this.props.callback()
                        } catch(e) {
                          // TODO: Meaningful error handling.
                          console.log('addBooksMutation error: ' + e)
                        }
                      }}>
                    <Text style={CommonStyles.buttonText}>
                      {`Add Books (${this.state.scannedBooks.length})`}
                    </Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={CommonStyles.button}
                    onPress={() => {
                      this.setState({
                        modalVisible: false,
                        scannedBooks: [],
                    })
                  }}>
                    <Text style={CommonStyles.buttonText}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              </Modal>
            </View>
          </View>
        )}}
      </Mutation> )
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: '#fff',
    alignItems: 'stretch',
    marginTop: 50,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2},
    shadowOpacity: 0.5,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 3,
    height: 600,
  },
  modalTitleContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#008B8B'
  },
  modalTitle: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 18,
    padding: 20,
    fontFamily: OXYGEN_BOLD
  },
  camera: {
    alignSelf: 'stretch',
    height: 200,
  },
  scannedBookContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    padding: 10,
    margin: 5,
    borderColor: '#008B8B',
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'space-between'
  },
  scannedBook: {
  },
  scannedBookTitle: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 14
  },
  scannedBookAuthor: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14
  },
  scannedBookRemoveIcon: {
  }
})

const ADD_BOOKS_MUTATION = gql`
  mutation AddBooksToShelfMutation(
    $books: BooksInput!,
    $bookshelfId: ID! ) {
      addBooksToShelf(
        books: $books,
        bookshelfId: $bookshelfId ) {
          id
          books {
            author
            title
            isbn
          }
        }
      }`
