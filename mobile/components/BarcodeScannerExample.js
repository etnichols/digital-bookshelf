import  gql from 'graphql-tag'
import { Constants, BarCodeScanner, Permissions } from 'expo';
import React from 'react';
import { Mutation } from 'react-apollo'
import { Alert, StyleSheet, Text, View, TouchableHighlight, AsyncStorage, Modal, ScrollView } from 'react-native';
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
class BarCodeScannerExample extends React.Component {
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

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = data => {
    Alert.alert(
      'Scan successful!',
      JSON.stringify(data)
    );
  };

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
            <View style={commonstyles.modalContainer}>
            <Text style={commonstyles.modalTitle}>Add one or many Books.</Text>
              {
                this.state.hasCameraPermission === null ?
                <Text>Requesting for camera permission</Text> :
                  this.state.hasCameraPermission === false ?
                    <Text>Camera permission is not granted</Text> :
                    <BarCodeScanner
                      onBarCodeRead={this._handleBarCodeRead}
                      style={commonstyles.camera}
                    />
                }
                <TouchableHighlight
                  style={commonstyles.cancelButton}
                  onPress={() => {
                    this.setState({
                      modalVisible: false
                  })
                }}>
                  <Text style={commonstyles.cancelButtonText}>Cancel</Text>
                </TouchableHighlight>
              </View>
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

export default BarCodeScannerExample
