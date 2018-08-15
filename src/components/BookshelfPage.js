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
    return (
      <Query query={ANOTHER_FEED_QUERY}>
        {({ data, loading, error, refetch }) => {
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

          return (
            <Fragment>
              <h1>This is your bookshelf.</h1>
              <button onClick={this.cleanup}>Logout.</button>
              {data.feed &&
                data.feed.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    refresh={() => refetch()}
                    isDraft={!post.isPublished}
                  />
                ))}
              {this.props.children}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export const ANOTHER_FEED_QUERY = gql`
  query AnotherFeedQuery {
    feed {
      id
      text
      title
      isPublished
    }
  }
`

export default withRouter(BookshelfPage)
