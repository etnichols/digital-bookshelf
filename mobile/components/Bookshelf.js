import  gql from 'graphql-tag'
import React from 'react';
import { Query } from 'react-apollo';
import { AsyncStorage, StyleSheet, Text, TouchableHighlight, ScrollView, View } from 'react-native';

import AddBookModal from './AddBookModal'
import Book from './Book'
import { commonstyles } from './commonstyles'

class Bookshelf extends React.Component {
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
    // const bookshelfId = `cjm9z9jqq5ofu0b01jup1cxkf`
    return (
      <Query query={BOOKSHELF_QUERY} variables={{id: bookshelfId}}>
        {
          ( { data, loading, error, refetch } ) => {

          if(loading){
            return (
              <View style={commonstyles.container}>
                <Text style={commonstyles.loadingText}>
                  Loading...
                </Text>
              </View> )
          }

          if(error){
            return (
            <View style={commonstyles.container}>
              <Text style={commonstyles.loadingText}>
                {`${error}`}
              </Text>
            </View> )
          }

          const shelf = !data.bookshelf.books ? <Text>{`No books :(`}</Text> :
            data.bookshelf.books.map(
              (book, i) =>
                ( <Book key={i} data={book} /> ) )

          return (
            <ScrollView contentContainerstyle={commonstyles.container}>
              <View style={styles.shelfContainer}>
                { shelf }
              </View>

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
                onPress={ () => {
                  this.setState({
                    modalVisible: true
                  })
                }}
                style={commonstyles.button}
              >
                <Text style={commonstyles.buttonText}>
                  {'Add Books'}
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={ async () => {
                  await AsyncStorage.removeItem('dbtoken', () => {
                    console.log('logout - removed token')
                  })
                  this.props.navigation.navigate('Launch')
                }}
                style={commonstyles.button}
              >
                <Text style={commonstyles.buttonText}>
                  {'Logout'}
                </Text>
              </TouchableHighlight>
            </ScrollView>
          )
        }
      }
      </Query>
    )
  }
}

const styles = StyleSheet.create({
  shelfContainer:{
    paddingTop: 20,
    flex: 1,
  }
})

const BOOKSHELF_QUERY = gql`
  query BookshelfQuery($id: ID!) {
    bookshelf(id: $id) {
      books {
        title
        isbn
      }
    }
  }
`

export default Bookshelf
