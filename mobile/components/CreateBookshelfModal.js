import _ from 'lodash'
import { Constants, BarCodeScanner, Permissions } from 'expo'
import  gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { Alert, AsyncStorage, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View  } from 'react-native'
import t from 'tcomb-form-native'

import ScannedBook from './ScannedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR } from './CommonStyles'

let Form = t.form.Form
const BookshelfName = t.refinement(t.String, name => name.length > 2)
let Bookshelf = t.struct({
  name: BookshelfName,
})

const options = {
  fields: {
    name: {
      label: 'Bookshelf Name',
      error: 'Bookshelf name must be at least two characters long.'
    }
  }
}

export default class CreateBookshelfModal extends React.Component {
  constructor(props){
    super(props)
    this._updateCache = this._updateCache.bind(this)
    this._onChange = this._onChange.bind(this)
    this.state = {
          value: {
            name: ''
          },
          hasCameraPermission: null,
          hasError: false,
          modalVisible: false
        }
  }

  componentDidMount() {
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
    })
  }

  // TODO: Figure out caching for this. Might have to do a query for users shelves.
  _updateCache(cache, { data: response }){
    // const {bookshelfId} = this.props
    // const readFragment = cache.readFragment({
    //   id: bookshelfId,
    //   fragment: gql`
    //     fragment myBookFragment on Bookshelf {
    //       books {
    //         isbn
    //         author
    //         title
    //         description
    //       }
    //     }`
    // })
    //
    // // TODO: This should be current books concat with new books, once
    // // The AddBooksMutation is updated.
    // let updatedFragment = readFragment
    // updatedFragment.books = response.addBooksToShelf.books
    //
    // cache.writeFragment({
    //   id: bookshelfId,
    //   fragment: gql`
    //     fragment myBookFragment on Bookshelf {
    //       books {
    //         isbn
    //         author
    //         title
    //         description
    //       }
    //     }`,
    //   data: updatedFragment
    // })
  }

  _onChange(value){
    this.setState({value: value, hasError: false})
  }

  render(){
    const {
      errorMessage,
      hasError,
      modalVisible,
      value
     } = this.state

    return (
      <Mutation
        mutation={ADD_BOOKSHELF_MUTATION}
        update={this._updateCache}
      >
      { (addBookshelfMutation, { data, loading, error }) => {
        console.log('Add BookshelfMutation error: ' + JSON.stringify(error,null,2))
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
                    Create a new Bookshelf.
                  </Text>
                </View>
                <View style={styles.formContainer}>
                  <Form
                    ref={ref =>{ this.form = ref } }
                    type={Bookshelf}
                    value={value}
                    onChange={this._onChange}
                    options={options}
                  />
                </View>
                  { hasError &&
                    <Text style={CommonStyles.errorText}>{errorMessage}</Text> }
                  <TouchableHighlight
                    disabled={value.name.length > 2 ? false : true}
                    style={value.name.length > 2 ?
                      CommonStyles.button : CommonStyles.disabledButton }
                    onPress={async e => {
                      const formData = this.form.getValue()
                        try {
                          const response = await addBookshelfMutation({
                            variables: formData
                          })
                          this._hideModal()
                          this.props.callback()
                        } catch(e) {
                          // TODO: Meaningful error handling.
                          console.log('addBookshelfMutation error: ' + e)
                        }
                      }}>
                    <Text style={CommonStyles.buttonText}>
                      Create Bookshelf
                    </Text>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={CommonStyles.button}
                    onPress={() => {
                      this.setState({
                        modalVisible: false,
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

// TODO: Move Modal Styling to its own component, consider creating a CustomModal component since
// this is going to be shared elsewhere.
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center'
  },
  formContainer: {
    alignItems: 'stretch',
    margin: 10,
    paddingVertical: 10,
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
})

const ADD_BOOKSHELF_MUTATION = gql`
  mutation AddBookshelfMutation( $name: String! ) {
      createBookshelf( name: $name ) {
          id
          name
        }
      }`
