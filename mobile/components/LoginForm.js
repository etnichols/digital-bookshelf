import React from 'react';

import  gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import { CommonStyles, BLUE_HEX } from './CommonStyles'

let Form = t.form.Form

const UserOrPhone = t.refinement(t.String, username => {
  const reUser = /^[a-z0-9_]([.](?![._])|[a-z0-9]){3,20}[a-z0-9_]$/

  // TODO: User google18n number validator here.

  return re.test(String(username).toLowerCase())
})

let Login = t.struct({
  userOrPhone: UserOrPhone,
  password: t.String
})

let options = {
  fields: {
    userOrPhone: {
      label: 'Username or Phone Number',
      autoCapitalize: 'none',
      error: 'Please enter a valid username or phone number.'
    },
    password: {
      secureTextEntry: true,
     }
  }
}

export default class LoginForm extends React.Component {

  static navigationOptions = {
      title: 'Login'
    };

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
          value: {
            userOrPhone: '',
            password: ''
          },
          hasError: false,
          errorMessage: null
        }
  }

  onChange(value){
    value.userOrPhone = value.userOrPhone.toLowerCase()
    this.setState({
      value: value,
      hasError: false,
      errorMessage: null
    })
  }

  render(){
    const { hasError, errorMessage } = this.state

    return (
      <Mutation mutation={LOGIN_MUTATION}>
      { (loginMutation, { data, loading, error }) => {
        return (
          <View style={styles.loginContainer}>
            <Form
              ref="form"
              type={Login}
              value={this.state.value}
              onChange={this.onChange}
              options={options}
            />
            { hasError &&
              <Text style={CommonStyles.errorText}>{errorMessage}</Text> }
            <TouchableHighlight
              style={CommonStyles.button}
              onPress={async e => {
                const formData = this.state.value
                try {
                  const response = await loginMutation({variables: formData})
                  console.log('Loginform account response: ' + JSON.stringify(response))
                  const user = response.data.login.user
                  const token = response.data.login.token
                  if(token){
                    await AsyncStorage.setItem('dbtoken', token)
                    if(user){
                      if(!user.isConfirmed){
                        this.props.navigation.navigate('ConfirmAccount')
                      }
                    } else {
                      this.props.navigation.navigate('Bookshelves')
                    }
                  }
                } catch(e){
                  // TODO: If incorrect code, show prompt for resending code.
                  console.log('Login error: ' + JSON.stringify(e, null, 2))
                  this.setState({
                    hasError: true,
                    errorMessage: e.message
                  })
                }
            }}>
              <Text style={CommonStyles.buttonText}>Login</Text>
            </TouchableHighlight>
          </View>
        )
      }}
      </Mutation>
    )
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    padding: 10,
    margin: 10,
  },
})

const LOGIN_MUTATION = gql`
  mutation LoginMutation(
    $userOrPhone: String!,
    $password: String! ) {
      login(
        userOrPhone: $userOrPhone,
        password: $password ) {
          token
          user {
            isConfirmed
          }
        }
  }
`
