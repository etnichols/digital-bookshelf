import _ from 'lodash'
import  gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { CommonStyles, LIGHT_GREEN_HEX, BLUE_HEX, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class SelectedBook extends React.Component {
  constructor(props){
    super(props)
    this._updateCache = this._updateCache.bind(this)
  }

  _updateCache(cache, { data: response }){
    const { bookshelfId, onDeleteCallback } = this.props
    const readFragment = cache.readFragment({
      id: bookshelfId,
      fragment: gql`
        fragment myBookFragment on Bookshelf {
          books {
            isbn
            author
            title
            description
          }
        }`
    })

    // console.log('read fragment from cache: ' + JSON.stringify(readFragment))
    const removedBookIsbn = response.removeBookFromShelf.isbn
    _.remove(readFragment.books, {isbn: removedBookIsbn})
    console.log('updated fragment after remove: ' + JSON.stringify(readFragment,null,2))
    cache.writeFragment({
      id: bookshelfId,
      fragment: gql`
        fragment myBookFragment on Bookshelf {
          books {
            isbn
            author
            title
            description
          }
        }`,
      data: readFragment
    })

    onDeleteCallback()
  }

  render(){
    const { book, onDeleteCallback, bookshelfId } = this.props

    if(!book){
      return null
    }

    return (
      <Mutation
        mutation={REMOVE_BOOK_MUTATION}
        update={this._updateCache}
      >
      { (removeBookMutation, {data, loading, error}) => {
        return (
          <View style={styles.bookContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{`Completed`}</Text>
            </View>
            <Text style={styles.bookDescription}>{book.description}</Text>
            <TouchableHighlight style={styles.shareButton} onPress={ async e => {
              console.log('You pressed the recommend button')
              // share book logic
            }}>
              <Text style={styles.shareButtonText}>Recommend</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.deleteButton} onPress={ async e => {
              try {
                const response = await removeBookMutation({
                  variables: {
                    bookshelfId: bookshelfId,
                    isbn: book.isbn
                  }
                })
              } catch(e){
                console.log('Error removing book from shelf: ' + e)
              }
            }}>
              <Text style={styles.deleteButtonText}>Delete Book</Text>
            </TouchableHighlight>
          </View> )
        }}
      </Mutation>
    )
  }
}

const styles = StyleSheet.create({
  bookContainer: {
    flex: 1,
    alignItems: 'stretch',
    padding: 20
  },
  bookTitle: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 24,
    margin: 5,
  },
  statusContainer: {
    backgroundColor: LIGHT_GREEN_HEX,
    borderRadius: 6,
  },
  statusText: {
    fontFamily: OXYGEN_BOLD,
    fontSize: 14,
    color: '#fff',
    padding: 6
  },
  bookDescription: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
    margin: 5,
    lineHeight: 22,
  },
  deleteButtonText: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
    padding: 8,
    color: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 200,
    borderRadius: 30,
    borderColor: 'red',
    borderWidth: 1,
    paddingHorizontal: 30,
    marginTop: 10,
    alignSelf: 'center',
  },
  shareButtonText: {
    fontFamily: OXYGEN_REGULAR,
    fontSize: 14,
    padding: 8,
    color: LIGHT_GREEN_HEX,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 200,
    borderRadius: 30,
    borderColor: LIGHT_GREEN_HEX,
    borderWidth: 1,
    paddingHorizontal: 30,
    marginTop: 10,
    alignSelf: 'center',
  },
})

const REMOVE_BOOK_MUTATION = gql`
  mutation RemoveBookFromShelfMutation(
    $bookshelfId: ID!,
    $isbn: String! ) {
      removeBookFromShelf(
        bookshelfId: $bookshelfId,
        isbn: $isbn ) {
          isbn
        }
    }`
