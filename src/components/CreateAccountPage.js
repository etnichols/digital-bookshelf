import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { DRAFTS_QUERY } from './DraftsPage'

class CreateAccountPage extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }

  // TODO(etnichols): real form and password validation
  isFormValid(){
    for(let key in this.state){
      if(this.state[key] === ''){
        return false
      }
    }
    return true
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_ACCOUNT_MUTATION}
        // update={(cache, { data }) => {
        //   const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
        //   cache.writeQuery({
        //     query: DRAFTS_QUERY,
        //     data: { drafts: drafts.concat([data.createDraft]) },
        //   })
        // }}
      >
        {(createUser, { data, loading, error }) => {
          return (
            <div className="pa4 flex justify-center bg-white">
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  const { firstName, lastName, email, password } = this.state
                  await createUser({
                    variables: {
                      firstName: firstName,
                      lastName: lastName,
                      email: email,
                      password: password
                    },
                  })
                  this.props.history.replace('/')
                }}
              >
                <h1>Create Account</h1>
                <input
                  autoFocus
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ firstName: e.target.value })}
                  placeholder="First name"
                  type="text"
                  value={this.state.firstName}
                />
                <input
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ lastName: e.target.value })}
                  placeholder="Last name"
                  type="text"
                  value={this.state.lastName}
                />
                <input
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ email: e.target.value })}
                  placeholder="Email address"
                  type="text"
                  value={this.state.email}
                />
                <input
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ password: e.target.value })}
                  placeholder="Password (at least 7 characters)"
                  type="password"
                  value={this.state.password}
                />
                <input
                  className={`pa3 bg-black-10 bn ${this.isFormValid() &&
                    'dim pointer'}`}
                  disabled={!this.isFormValid()}
                  type="submit"
                  value="Create"
                />
                <a className="f6 pointer" onClick={this.props.history.goBack}>
                  or cancel
                </a>
              </form>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation(
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String!) {
      createUser(
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        password: $password ) {
          firstName
          lastName
          id
    }
  }
`

export default withRouter(CreateAccountPage)
