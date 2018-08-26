import React from 'react';

import { Query } from 'react-apollo';
import  gql from 'graphql-tag'
import { Actions, Scene, Router } from 'react-native-router-flux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import Book from './Book'

class Bookshelf extends React.Component {
  render(){
    console.log('bookshelfId: ' + this.props.bookshelfId)
    return (
      <Query query={BOOKSHELF_QUERY} variables={{id: this.props.bookshelfId}}>
        {
          ( { data, loading, error, refetch } ) => {
          if(loading){
            return (
              <Text>Loading...</Text>
            )
          }

          if(error){
            return(
              <Text>{`${error}`}</Text>
            )
          }

          console.log('Bookshelf Query data: ' + JSON.stringify(data, null, 2))

          const shelf = !data.bookshelf.books ? <Text>{`No books :(`}</Text> :
            data.bookshelf.books.map(
              book => ( <Book data={book} /> ))
          return (
            <View style={styles.container}>
              {shelf}
              <TouchableHighlight onPress={ () => { Actions.entry() } }>
                <Text>{'Logout (not really logout)'}</Text>
              </TouchableHighlight>
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Bookshelf
