import React from 'react';

import { Query } from 'react-apollo';
import  gql from 'graphql-tag'
import { Scene, Router } from 'react-native-router-flux';
import { StyleSheet, Text, View } from 'react-native';

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
              book => ( <View>
                          <Text>{`Title: ${book.title}`}</Text>
                          <Text>{`ISBN: ${book.isbn}`}</Text>
                        </View> ))
          return (
            <View style={styles.container}>
              {shelf}
            </View>
          )
        }
      }
      </Query>

    )

  }
}

// Query fails on
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
