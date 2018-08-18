import React, { Component, Fragment } from 'react'
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

import FeedPage from './FeedPage'
import DraftsPage from './DraftsPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import CreateAccountPage from './CreateAccountPage'
import LoginPage from './LoginPage'

import 'tachyons'

export default class NavBar extends Component {
  render() {
    return (
        <Fragment>
            <Link
              className="link dim black b f6 f5-ns dib mr3"
              to="/"
              title="Feed"
            >
              Blog
            </Link>
            <NavLink
              className="link dim f6 f5-ns dib mr3 black"
              activeClassName="gray"
              exact={true}
              to="/"
              title="Feed"
            >
              Feed
            </NavLink>
            <NavLink
              className="link dim f6 f5-ns dib mr3 black"
              activeClassName="gray"
              exact={true}
              to="/drafts"
              title="Drafts"
            >
              Drafts
            </NavLink>
            <NavLink
              className="link dim f6 f5-ns dib mr3 black"
              activeClassName="gray"
              exact={true}
              to="/login"
              title="Login"
            >
              Login
            </NavLink>
            <Link
              to="/signup"
              className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
            >
            Create Account
            </Link>
          </nav>
        </Fragment>
    )
  }
}
