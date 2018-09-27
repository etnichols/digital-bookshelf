import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookModal from './AddBookModal'
import Book from './Book'
import BookshelfLedge from './BookshelfLedge'
import { CommonStyles, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelf extends React.Component {
  constructor(){
    super()
    this._hideModal = this._hideModal.bind(this)
    this.state = {
      modalVisible: false
    }
  }

  _createBookshelf(books){
    const shelf = !books.length ?
      <Text style={styles.emptyShelfText}>{`Your shelf is empty. Add some books!`}</Text> :
      books.map(
        (book, i) =>
          ( <Book key={i} data={book} /> ) )

    return shelf
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
    // const bookshelfId = `cjmil956x041g0b45loyq2a0e`
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
  }
})

const BOOKSHELF_QUERY = gql`
  query BookshelfQuery($id: ID!) {
    bookshelf(id: $id) {
      books {
        author
        title
        isbn
      }
    }
  }
`
