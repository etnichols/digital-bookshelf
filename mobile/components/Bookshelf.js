import  gql from 'graphql-tag'
import React from 'react';
import { Query } from 'react-apollo';
import { AsyncStorage, StyleSheet, Text, TouchableHighlight, ScrollView } from 'react-native';

import AddBooksModal from './AddBooksModal'
import Book from './Book'
import commonstyles from './commonstyles'

class Bookshelf extends React.Component {
  constructor(){
    super()
    this.state = {
      modalVisible: false
    }
  }


  static navigationOptions = {
      title: 'Your Bookshelf',
      headerLeft: null
    }

  render(){
    const bookshelfId = this.props.navigation.getParam('bookshelfId', 1);
    return (
      <Query query={BOOKSHELF_QUERY} variables={{id: bookshelfId}}>
        {
          ( { data, loading, error, refetch } ) => {

          if(loading){ return ( <Text>Loading...</Text> ) }

          if(error){ return( <Text>{`${error}`}</Text> ) }

          const shelf = !data.bookshelf.books ? <Text>{`No books :(`}</Text> :
            data.bookshelf.books.map(
              (book, i) =>
                ( <Book key={i} data={book} /> ) )

          return (
            <ScrollView contentContainerstyle={commonstyles.container}>
              { shelf }

              <AddBooksModal modalVisible={this.state.modalVisible} />

              <TouchableHighlight
                onPress={ () => {
                  console.log('mod vis')
                  this.setState({
                    modalVisible: true
                  })
                  // this.props.navigation.navigate('AddBooksModal')
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
