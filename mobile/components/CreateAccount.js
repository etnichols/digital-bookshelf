import  gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableHighlight, View  } from 'react-native'
import t from 'tcomb-form-native'

import { CommonStyles } from './CommonStyles'

let Form = t.form.Form

let User = t.struct({
  firstName: t.String,
  lastName: t.String,
  email: t.String,
  password: t.String
})

let options = {
  fields: {
    password: {
      secureTextEntry: true,
      help: 'Must be at least 8 characters in length.'
    },
    email: {
      autoCapitalize: 'none',
      error: 'Insert a valid email.' 
   }
  }
}

export default class CreateAccount extends React.Component {

  static navigationOptions = {
      title: 'Create Account'
    };

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
          value: {
            firstName: '',
            lastName: '',
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
    const { hasError, errorMessage } = this.state

    return (
      <Mutation mutation={CREATE_ACCOUNT_MUTATION} >
      { (createUserAndBookshelf, { data, loading, error }) => {
        return (
          <ScrollView contentContainerStyle={CommonStyles.formContainer}>
            <Form
              ref="form"
              type={User}
              value={this.state.value}
              onChange={this.onChange}
              options={options}/>
            <TouchableHighlight
              style={CommonStyles.button}
              onPress={async e => {
                const formData = this.state.value
                try {
                  const response = await createUserAndBookshelf({variables: formData})
                  const token = response.data.createAccount.token
                  if(token){
                    await AsyncStorage.setItem('dbtoken', token)
                    this.props.navigation.navigate('Bookshelf', {
                      bookshelfId: response.data.createAccount.bookshelf.id
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
              <Text style={CommonStyles.buttonText}>Create Account</Text>
            </TouchableHighlight>
            {hasError && <Text style={CommonStyles.errorText}>{errorMessage}</Text>}
          </ScrollView>
        )
      }}
      </Mutation>
    )
  }
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation1(
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String! ) {
      createAccount(
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        password: $password ) {
          token
          user {
            id
          }
          bookshelf {
            id
          }
        }
  }
`
