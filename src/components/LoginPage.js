import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import  { gql } from 'apollo-boost'

class LoginPage extends Component {
  state = {
    email: '',
    password: '',
    failed: false,
    errorMessage: null,
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
        mutation={LOGIN_MUTATION}
        // update={(cache, { data }) => {
        //   const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
        //   cache.writeQuery({
        //     query: DRAFTS_QUERY,
        //     data: { drafts: drafts.concat([data.createDraft]) },
        //   })
        // }}
      >
        {(login, { data, loading, error }) => {
          return (
            <div>
            <h1>Digital Bookshelf.</h1>
            <div className="pa4 flex justify-center bg-white">
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  const { email, password } = this.state
                  await login({
                    variables: {
                      email: email,
                      password: password
                    },
                  }).then(res => {
                    localStorage.setItem('token', res.data.login.token)
                    this.props.history.replace(`/bookshelf/${res.data.login.bookshelfId}`)
                  }).catch(e => {
                    this.setState({
                      failed: true,
                      errorMessage: e
                    })
                    console.log('error logging in: ' + e)
                  });
                }}
              >
                <h3>Login</h3>
                <input
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ email: e.target.value, failed: false })}
                  placeholder="Email address"
                  type="text"
                  value={this.state.email}
                />
                <input
                  className="w-100 pa2 mv2 br2 b--black-20 bw1"
                  onChange={e => this.setState({ password: e.target.value, failed: false })}
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                />
                <input
                  className={`pa3 bg-black-10 bn ${this.isFormValid() &&
                    'dim pointer'}`}
                  disabled={!this.isFormValid()}
                  type="submit"
                  value="Login"
                />
              </form>
              {this.state.failed && <p>{`Failed to login. Reason: ${this.state.errorMessage}`}</p>}
            </div>
          </div>
          )
        }}
      </Mutation>
    )
  }
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!,
    $password: String!) {
      login(
        email: $email,
        password: $password ) {
          token
          user {
            email
          }
          bookshelfId
    }
  }
`

export default withRouter(LoginPage)
