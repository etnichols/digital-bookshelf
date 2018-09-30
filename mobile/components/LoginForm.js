import React from 'react';

import  gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import { CommonStyles, BLUE_HEX } from './CommonStyles'

let Form = t.form.Form

let User = t.struct({
  email: t.String,
  password: t.String
})

let options = {
  fields: {
    email: { autoCapitalize: 'none' },
    password: { secureTextEntry: true }
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
            email: '',
            password: ''
          },
          hasError: false,
          errorMessage: null
        }
  }

  onChange(value){
    this.setState({
      value: value,
      hasError: false,
      errorMessage: null})
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
              type={User}
              value={this.state.value}
              onChange={this.onChange}
              options={options}/>
            <TouchableHighlight
              style={CommonStyles.button}
              onPress={async e => {
                const formData = this.state.value
                console.log('formData: ' + JSON.stringify(formData, null, 2))
                try {
                  const response = await loginMutation({variables: formData})
                  const token = response.data.login.token
                  if(token){
                    await AsyncStorage.setItem('dbtoken', token)
                    this.props.navigation.navigate('Bookshelf', {
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
              <Text style={CommonStyles.buttonText}>Login</Text>
            </TouchableHighlight>
            {hasError && <Text style={CommonStyles.errorText}>{errorMessage}</Text>}
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
