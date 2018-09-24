import { Constants, BarCodeScanner, Permissions } from 'expo'
import  gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { Alert, AsyncStorage, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View  } from 'react-native'
import t from 'tcomb-form-native'

import { CommonStyles, OXYGEN_BOLD } from './CommonStyles'

let Form = t.form.Form
let Book = t.struct({
  title: t.String,
  isbn: t.String
})

export default class AddBookModal extends React.Component {
  constructor(props){
    super(props)
    this._maybeFetchBook = this._maybeFetchBook.bind(this)
    this._requestCameraPermission = this._requestCameraPermission.bind(this)
    this._hideModal = this._hideModal.bind(this)

    this.state = {
          hasCameraPermission: null,
          value: {
            title: '',
            isbn: '',
          },
          hasError: false,
          errorMessage: null,
          modalVisible: false,
          response: '',
          scannedBooks: [],
      }
  }

  componentDidMount() {
    this._requestCameraPermission();
  }

  componentWillReceiveProps(props){
    if(props.modalVisible){
      this.setState({
        modalVisible: props.modalVisible
      })
    }
  }

  _hideModal(){
    this.setState({
      modalVisible: false,
      scannedBooks: []
    })
  }

  _delay(time){
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), time)
    })
  }

  async _requestCameraPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  // Fetch a book from a database.
  async _maybeFetchBook(data) {
    const isbn = data.data

    // first check if book has already been added.
    let scannedBooks = this.state.scannedBooks
    if(scannedBooks.filter(book => book.isbn === isbn).length > 0){
      this.setState({
        hasError: true,
        errorMessage: 'Book already scanned during this session.'
      }, () => {
        setTimeout(() => {
          this.setState({
            hasError: false,
            errorMessage: null
          })
        }, 4000)
      })
      return null
    }

    const queryString =
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDsbGjdoQdTMPfP7q7WubHV21NKdrjTLtA`
    const opts = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    try {
      const response = await fetch(queryString, opts)
      const json = await response.json();

      if(json.totalItems < 1){
          this.setState({
            hasError: true,
            errorMessage: 'ISBN not recognized :('
          }, () => {
            setTimeout(() => {
              this.setState({
                hasError: false,
                errorMessage: null
              })
            }, 3000)
          })
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
    const { hasError, errorMessage, modalVisible, response, scannedBooks } = this.state
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
                {
                  this.state.hasCameraPermission === null ?
                  <Text>Requesting for camera permission</Text> :
                    this.state.hasCameraPermission === false ?
                      <Text>Camera permission is not granted</Text> :
                      <BarCodeScanner
                        style={styles.camera}
                        onBarCodeRead={ async data => {
                            const book = await this._maybeFetchBook(data)
                            if(book){
                              console.log('\n\ngot book not null!: ' + JSON.stringify(book))
                              let curBooks = this.state.scannedBooks
                              curBooks.push(book)
                              this.setState({
                                scannedBooks: curBooks
                              })
                            }
                            await this._delay(500)
                          }}
                      />
                  }
                  {
                    hasError &&
                    <Text style={CommonStyles.errorText}>{errorMessage}</Text>
                  }

                  <TouchableHighlight
                    style={CommonStyles.button}
                    onPress={async () => {
                      console.log('adding ' + this.state.scannedBooks.length + ' books')
                        try {
                          const response = await addBooksMutation({
                            variables: {
                              bookshelfId: this.props.bookshelfId,
                              books: { books: this.state.scannedBooks }
                            }
                          })
                          console.log('response from addBooksMutation: ' + JSON.stringify(response))
                          this._hideModal();
                          this.props.callback()
                        } catch(e) {
                          console.log('addBooksMutation error: ' + e)
                        }
                      }}>
                    <Text style={CommonStyles.buttonText}>
                      {
                        scannedBooks.length > 0 ?
                        `Add Books (${this.state.scannedBooks.length})` :
                        `Can't add books yet`
                      }
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
        )
      }}
      </Mutation>

    )
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
    marginTop: 200,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2},
    shadowOpacity: 0.5,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 3,
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
