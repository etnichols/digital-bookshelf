import React, {Fragment} from 'react'
import ReactDOM from 'react-dom'
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink, createHttpLink } from 'apollo-link-http'

import BookshelfPage from './components/BookshelfPage'
import FeedPage from './components/FeedPage'
import DraftsPage from './components/DraftsPage'
import CreatePage from './components/CreatePage'
import DetailPage from './components/DetailPage'
import CreateAccountPage from './components/CreateAccountPage'
import LoginPage from './components/LoginPage'

import 'tachyons'
import './index.css'

const LOCAL_HOST = `http://localhost:4000`

const httpLink = createHttpLink({
  uri: LOCAL_HOST
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from session storage if it exists.
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/bookshelf/:id" component={BookshelfPage} />
          <Route path="/signup" component={CreateAccountPage} />
          <Route path="/drafts" component={DraftsPage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/post/:id" component={DetailPage} />
        </Switch>
      </Fragment>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
