import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Post from '../components/Post'
import { Query } from 'react-apollo'
import  { gql } from 'apollo-boost'

class BookshelfPage extends Component {

  constructor(props){
    super(props)
    this.cleanup = this.cleanup.bind(this)
  }

  cleanup(){
    // Remove saved data from sessionStorage.
    sessionStorage.clear();
    this.props.history.replace('/')
  }

  render() {
    console.log(this.props.match.params.id + " and typeof id: " + typeof this.props.match.params.id)

    return (
      <Query
        query={BOOKSHELF_QUERY}
        variables={{ id: this.props.match.params.id }}
      >
        {({ data, loading, error, refetch }) => {
          console.log('data: ' + JSON.stringify(data))
          if (loading) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>Loading ...</div>
              </div>
            )
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>An unexpected error occured.</div>
              </div>
            )
          }

          const shelf = !data.bookshelf.books.length ? <p>{`No books :(`}</p> :
            data.bookshelf.books.map(
              book => ( <div>
                          <p>{`Title: ${book.title}`}</p>
                          <p>{`ISBN: ${book.isbn}`}</p>
                        </div> ))

          return (
            <Fragment>
              <h1>Your bookshelf</h1>
              <p>Red</p>
              {shelf}
              <button onClick={this.cleanup}>Logout.</button>
            </Fragment>
          )
        }}
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

export default withRouter(BookshelfPage)
