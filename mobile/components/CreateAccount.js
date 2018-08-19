import React from 'react';

import  gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Scene, Router, Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, ScrollView } from 'react-native';
import t from 'tcomb-form-native';

let Form = t.form.Form

let User = t.struct({
  firstName: t.String,
  lastName: t.String,
  email: t.String,
  password: t.String
})

let options = {
  fields: {
    password: { secureTextEntry: true }
  }
}

class CreateAccount extends React.Component {
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

          <ScrollView style={styles.container}>
            <Form
              ref="form"
              type={User}
              value={this.state.value}
              onChange={this.onChange}
              options={options}/>
            <TouchableHighlight
              style={styles.button}
              onPress={async e => {
                const formData = this.state.value
                try {
                  const response = await createUserAndBookshelf({variables: formData})
                  console.log('res -> ' + JSON.stringify(response, 2, null))
                  const token = response.data.createAccount.token
                  if(token){
                    await AsyncStorage.setItem('dbtoken', token)
                    console.log('set token successfully')
                    Actions.bookshelf({
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
              <Text>Create Account</Text>
            </TouchableHighlight>
            {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
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

const styles = StyleSheet.create({
  errorText: {
    padding: 20,
    color: 'red',
    alignSelf: 'center',
  },
  container: {
    alignSelf: 'stretch',
    padding: 10,
    marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ADD8E6',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center'
  }
});

export default CreateAccount
