import  gql from 'graphql-tag'
import React from 'react';
import { Mutation } from 'react-apollo'
import { Scene, Router, Actions } from 'react-native-router-flux';
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
          modalVisible: props.modalVisible
      }
  }

  componentWillReceiveProps(props){
    if(props.modalVisible){
      this.setState({
        modalVisible: true
      })
    }
  }

  onChange(value){
    this.setState({value: value, hasError: false})
  }

  render(){
    const { hasError, errorMessage, modalVisible } = this.state
    return (
      <Mutation mutation={ADD_BOOK_MUTATION} >
      { (addBooksToShelf, { data, loading, error }) => {
        return (
          <View style={commonstyles.modal}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
              }}
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
                  // try {
                  //   const response = await addBooksToShelf({variables: formData})
                  //   if(response){
                  //     Actions.bookshelf({
                  //       bookshelfId: bookshelfId
                  //     })
                  //   }
                  // } catch(e){
                  //   console.log('Error: ' + JSON.stringify(e, null, 2))
                  //   this.setState({
                  //     hasError: true,
                  //     errorMessage: e.message
                  //   })
                  // }
              }}>
                <Text style={commonstyles.buttonText}>Add Book to Shelf</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={commonstyles.button}
                onPress={() => {
                  this.setState({
                    modalVisible: false
                })
              }}>
                <Text style={commonstyles.buttonText}>Cancel</Text>
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

const ADD_BOOK_MUTATION = gql`
  mutation AddBookToShelfMutation(
    $title: String!,
    $isbn: String! ) {
      addBooksToShelf(
        title: $title,
        isbn: $isbn ) {
          books {
            title
            isbn
          }
        }
      }`

export default AddBooksModal
