import  gql from 'graphql-tag'
import React from 'react';
import { Mutation } from 'react-apollo'
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, Modal, ScrollView } from 'react-native';
import t from 'tcomb-form-native';

import commonstyles from './commonstyles'

let Form = t.form.Form

let Book = t.struct({
  title: t.String,
  isbn: t.String
})

let options = {
  // fields: {
  //   password: { secureTextEntry: true }
  // }
}

// TODO: Finish this class.
class AddBooksModal extends React.Component {
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
          value: {
            title: '',
            isbn: '',
          },
          hasError: false,
          errorMessage: '',
          modalVisible: false
      }
  }

  componentWillReceiveProps(props){
    if(props.modalVisible){
      this.setState({
        modalVisible: props.modalVisible
      })
    }
  }

  onChange(value){
    this.setState({value: value, hasError: false})
  }

  render(){
    const { hasError, errorMessage, modalVisible } = this.state
    return (
      <Mutation mutation={ADD_BOOKS_MUTATION} >
      { (addBooksToShelf, { data, loading, error }) => {
        return (
          <View style={commonstyles.modal}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
            >
            <ScrollView contentContainerStyle={commonstyles.modalContainer}>
            <Text style={commonstyles.modalTitle}>
              Add one or many Books.
            </Text>
              <Form
                ref="form"
                type={Book}
                value={this.state.value}
                onChange={this.onChange}
                options={options}/>
              <TouchableHighlight
                style={commonstyles.button}
                onPress={async e => {
                  this.setState({
                    modalVisible: true,
                  })
                  const formData = this.state.value
                  try {
                    const response = await addBooksToShelf({variables: {
                      bookshelfId: this.props.bookshelfId,
                      books: { books: [formData] }
                    }})
                    if(response){
                      console.log('got response! + ' + JSON.stringify(response, null, 2))
                      this.props.callback();
                    }
                  } catch(e){
                    console.log('Error: ' + JSON.stringify(e, null, 2))
                    this.setState({
                      hasError: true,
                      errorMessage: e.message
                    })
                  }
              }}>
                <Text style={commonstyles.buttonText}>Add Book to Shelf</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={commonstyles.cancelButton}
                onPress={() => {
                  this.setState({
                    modalVisible: false
                })
              }}>
                <Text style={commonstyles.cancelButtonText}>Cancel</Text>
              </TouchableHighlight>
              {hasError && <Text style={commonstyles.errorText}>{errorMessage}</Text>}
              </ScrollView>
            </Modal>
            </View>
        )
      }}
      </Mutation>

    )
  }
}

const ADD_BOOKS_MUTATION = gql`
  mutation AddBooksToShelfMutation(
    $books: BooksInput!,
    $bookshelfId: ID! ) {
      addBooksToShelf(
        books: $books,
        bookshelfId: $bookshelfId ) {
          books {
            title
            isbn
          }
        }
      }`

export default AddBooksModal
