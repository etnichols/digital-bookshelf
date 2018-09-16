import React from 'react';

import  gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Scene, Router, Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, ScrollView } from 'react-native';
import t from 'tcomb-form-native';

import commonstyles from './commonstyles';

let Form = t.form.Form

let User = t.struct({
  email: t.String,
  password: t.String
})

let options = {
  fields: {
    password: { secureTextEntry: true }
  }
}

class Login extends React.Component {
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
          value: {
            email: '',
            password: ''
          },
          hasError: false,
          errorMessage: ''
        }
  }

  onChange(value){
    this.setState({value: value, hasError: false})
  }

  render(){

    console.log('Login component; ' +JSON.stringify(this.props))

    const { hasError, errorMessage } = this.state

    return (
      <Mutation mutation={LOGIN_MUTATION} >
      { (loginMutation, { data, loading, error }) => {
        return (
          <ScrollView contentContainerStyle={commonstyles.formContainer}>
            <Form
              ref="form"
              type={User}
              value={this.state.value}
              onChange={this.onChange}
              options={options}/>
            <TouchableHighlight
              style={commonstyles.button}
              onPress={async e => {
                const formData = this.state.value
                try {
                  const response = await loginMutation({variables: formData})
                  console.log('res -> ' + JSON.stringify(response, 2, null))
                  const token = response.data.login.token
                  if(token){
                    await AsyncStorage.setItem('dbtoken', token)
                    console.log('set token successfully')
                    Actions.bookshelf({
                      bookshelfId: response.data.login.bookshelfId
                    })
                  }
                } catch(e){
                  console.log('Error: ' + JSON.stringify(e, null, 2))
                  this.setState({
                    hasError: true,
                    errorMessage: e.message
                  })
                }
            }}>
              <Text style={commonstyles.buttonText}>Login</Text>
            </TouchableHighlight>
            {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
          </ScrollView>
        )
      }}
      </Mutation>

    )
  }
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $email: String!,
    $password: String! ) {
      login(
        email: $email,
        password: $password ) {
          token
          user {
            id
          }
          bookshelfId
        }
  }
`

export default Login
