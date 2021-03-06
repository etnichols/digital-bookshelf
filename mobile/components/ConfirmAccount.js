import gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { AsyncStorage, ScrollView, StyleSheet, Text, TouchableHighlight, View  } from 'react-native'
import t from 'tcomb-form-native'

import { CommonStyles } from './CommonStyles'

let Form = t.form.Form

const ConfirmationCode = t.refinement(t.String, code => code.length === 4)
let Confirmation = t.struct({
  confirmationCode: ConfirmationCode
})

const options = {
  fields: {
    confirmationCode: {
      error: 'Code must be 4 digits long.',
      keyboardType: 'numeric',
    }
  }
}

export default class ConfirmAccount extends React.Component {

  static navigationOptions = {
      title: 'Confirm Account',
      headerLeft: null,
    };

  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
          value: {
            confirmationCode: '',
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
      <Mutation mutation={CONFIRM_ACCOUNT_MUTATION} >
      { (confirmAccount, { data, loading, error }) => {
        return (
          <ScrollView contentContainerStyle={CommonStyles.formContainer}>
            <Form
              ref={ref => this.form = ref}
              type={Confirmation}
              value={this.state.value}
              onChange={this.onChange}
              options={options}
            />
            <TouchableHighlight
              style={CommonStyles.button}
              onPress={async e => {
                console.log('confirm account button pressed.')
                const formData = this.form.getValue()
                if(formData){
                  try {
                    const response = await confirmAccount({variables: formData})
                    console.log('Confirm account response: ' + JSON.stringify(response))
                    if(response){
                      this.props.navigation.navigate('Bookshelves')
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
              <Text style={CommonStyles.buttonText}>Confirm Account</Text>
            </TouchableHighlight>
            {hasError && <Text style={CommonStyles.errorText}>{errorMessage}</Text>}
          </ScrollView>
        )
      }}
      </Mutation>
    )
  }
}

const CONFIRM_ACCOUNT_MUTATION = gql`
  mutation ConfirmAccountMutation($confirmationCode: String!) {
      confirmAccount(confirmationCode: $confirmationCode) {
        token
      }
  }`
