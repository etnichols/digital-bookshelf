import React from 'react';

import  gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Scene, Router, Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage } from 'react-native';
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
          }
        }
  }

  onChange(value){
    this.setState({value: value})
  }

  render(){
    return (
      <Mutation mutation={CREATE_ACCOUNT_MUTATION} >
      { (createUserAndBookshelf, { data, loading, error }) => {
        return (
          <View style={styles.container}>
            <Form
              ref="form"
              type={User}
              value={this.state.value}
              onChange={this.onChange}
              options={options}/>
            <TouchableHighlight onPress={async e => {
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
                console.log('Error: ' + e)
              }
            }}>
              <Text>Create Account</Text>
            </TouchableHighlight>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});

export default CreateAccount
