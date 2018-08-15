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
import ApolloClient from 'apollo-boost'

import BookshelfPage from './components/BookshelfPage'
import FeedPage from './components/FeedPage'
import DraftsPage from './components/DraftsPage'
import CreatePage from './components/CreatePage'
import DetailPage from './components/DetailPage'
import CreateAccountPage from './components/CreateAccountPage'
import LoginPage from './components/LoginPage'


import 'tachyons'
import './index.css'

const client = new ApolloClient({ uri: 'http://localhost:4000' })

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/" component={LoginPage} />
          <Route path="/bookshelf" component={BookshelfPage} />
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
