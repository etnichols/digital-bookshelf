import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookModal from './AddBookModal'
import Book from './Book'
import { CommonStyles, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelf extends React.Component {
  constructor(){
    super()
    this._hideModal = this._hideModal.bind(this)
    this.state = {
      modalVisible: false
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
    // const bookshelfId = `cjmh2u8ti2i2a0b01vvwvp5hk`
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

          const shelf = !data.bookshelf.books.length ?
            <Text style={styles.emptyShelfText}>{`Your shelf is empty. Add some books!`}</Text> :
            data.bookshelf.books.map(
              (book, i) =>
                ( <Book key={i} data={book} /> ) )

          return (
            <ScrollView contentContainerstyle={CommonStyles.container}>
              <View style={styles.shelfContainer}>{shelf}</View>
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
