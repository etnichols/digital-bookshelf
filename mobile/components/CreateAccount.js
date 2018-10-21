import { SMS } from 'expo'
import gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableHighlight, View  } from 'react-native'
import t from 'tcomb-form-native'

import { CommonStyles } from './CommonStyles'

let Form = t.form.Form

const Email = t.refinement(t.String, email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
})

/**
 * Validates a username.
 *
 * Valid usernmes: 'jamesbook', 'book.gal', 'bookworm91', '____books____'
 * Invalid usernames: '....books', 'BIGBOOKS', '.'
 */
const Username = t.refinement(t.String, username => {
  const re = /\w{3,20}/
  return re.test(String(username))
})

const Name = t.refinement(t.String, name => name.length > 1)
const Password = t.refinement(t.String, password => password.length > 7)
const PhoneNumber = t.refinement(t.String, number => number.length > 7)

// TODO: Confirm password functionality.
let User = t.struct({
  firstName: Name,
  lastName: Name,
  username: Username,
  phoneNumber: PhoneNumber,
  password: Password
})

const options = {
  fields: {
    firstName: {
      error: 'Name must be at least 2 characters long.'
    },
    lastName: {
      error: 'Name must be at least 2 characters long.'
    },
    username: {
      error: 'User name must be 2-20 ',
      autoCapitalize: 'none'
    },
    phoneNumber: {
      placeholder: 'XXX-XXX-XXXX',
      autoCapitalize: 'none',
      keyboardType: 'numeric',
      error: 'Invalid phone number.'
   },
   password: {
     secureTextEntry: true,
     help: 'Must be at least 8 characters long.',
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
            username: '',
            phoneNumber: '',
            password: '',

          },
          hasError: false,
          errorMessage: ''
        }
  }

  onChange(value){
    value.username = value.username.toLowerCase()
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
              ref={ref => this.form = ref}
              type={User}
              value={this.state.value}
              onChange={this.onChange}
              options={options}
            />
            <TouchableHighlight
              style={CommonStyles.button}
              onPress={async e => {
                const formData = this.form.getValue()
                if(formData){
                  try {
                    const response = await createUserAndBookshelf({variables: formData})
                    const token = response.data.createAccount.token
                    if(token){
                      console.log('create account token: ' + token)
                      await AsyncStorage.setItem('dbtoken', token)
                      this.props.navigation.navigate('ConfirmAccount')
                    }
                  } catch(e){
                    console.log('Error: ' + JSON.stringify(e, null, 2))
                    this.setState({
                      hasError: true,
                      errorMessage: e.message
                    })
                  }
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
    $username: String!,
    $phoneNumber: String!,
    $password: String! ) {
      createAccount(
        firstName: $firstName,
        lastName: $lastName,
        username: $username,
        phoneNumber: $phoneNumber,
        password: $password ) {
          token
        }
  }
`
