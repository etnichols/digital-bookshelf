// TODO: Renders a list of Bookshelves.
import  gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import { AsyncStorage, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import AddBookButton from './AddBookButton'
import AddBookModal from './AddBookModal'
import Book from './Book'
import Bookshelf from './Bookshelf'
import BookIcon from './icons/BookshelfIcon'
import BookshelfLedge from './BookshelfLedge'
import SelectedBook from './SelectedBook'
import { CommonStyles, OXYGEN_BOLD, OXYGEN_REGULAR, OXYGEN_MONO_REGULAR } from './CommonStyles'

export default class Bookshelves extends React.Component {
  constructor(props){
    super(props)
    this._userId = props.navigation.getParam('userId', 1);
    this.state = {
      bookshelves: null,
    }
  }

  static navigationOptions = {
    tabBarLabel: 'Bookshelves',
    headerStyle: {
      backgroundColor: '#008B8B',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }

  render(){
    return (<Text>Test</Text>)
    // return (
    //   <Query query={BOOKSHELVES_QUERY} variables={{id: this._userId}}>
    //     { ( { data, loading, error, refetch } ) => {
    //       console.log('error!!!: ' + error)
    //       if(loading){
    //         return (
    //           <View style={CommonStyles.container}>
    //             <Text style={CommonStyles.loadingText}>
    //               Loading...
    //             </Text>
    //           </View> )
    //       }
    //
    //       if(error){
    //         return (
    //         <View style={CommonStyles.container}>
    //           <Text style={CommonStyles.loadingText}>
    //             {`${error}`}
    //           </Text>
    //         </View> )
    //       }
    //
    //       return (
    //         <ScrollView contentContainerstyle={CommonStyles.container}>
    //           <FlatList
    //             horizontal
    //             ref={ref => this.flatList = ref}
    //             data={booksWithAddButton}
    //             keyExtractor={(item, index) => item.id}
    //             extraData={this.state}
    //             renderItem={ ({ item, index }) => {
    //                 return (<Bookshelf
    //                         item={item}
    //                         index={index}
    //                         isSelected={false}
    //                         onPressItem={this._handleBookSelected}
    //                         />)
    //                       }
    //                     }
    //              />
    //           </ScrollView>)
    //         }}
    //     </Query>)
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
  },
  shelfContainer: {
    flex: 1,
    marginTop: 20,
  }
})

const BOOKSHELVES_QUERY = gql`
  query BookshelfQuery($userId: String!) {
    bookshelves(userId: $userId) {
      id
      name
      books {
        author
        title
        isbn
        description
      }
    }
  }`
