import  gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Scene, Router, Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View, TouchableHighlight, AsyncStorage, ScrollView } from 'react-native';
import t from 'tcomb-form-native';

let Form = t.form.Form

let Book = t.struct({
  title: t.String,
  isbn: t.String
})

// TODO: Finish this class.
class AddBook extends React.Component {
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)

    this.state = {
          value: {
            title: '',
            isbn: '',
          },
          hasError: false,
          errorMessage: ''
        }
  }

  onChange(value){
    this.setState({value: value, hasError: false})
  }

  render(){
    const { bookshelfId } = this.props
    const { hasError, errorMessage } = this.state

    return (
      <Mutation mutation={ADD_BOOK_MUTATION} >
      { (addBooksToShelf, { data, loading, error }) => {
        return (
          <ScrollView style={styles.container}>
            <Form
              ref="form"
              type={Book}
              value={this.state.value}
              onChange={this.onChange}
              options={options}/>
            <TouchableHighlight
              style={styles.button}
              onPress={async e => {
                const formData = this.state.value
                try {
                  const response = await addBooksToShelf({variables: formData})
                  if(response){
                    Actions.bookshelf({
                      bookshelfId: bookshelfId
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
              <Text>Add Book to Shelf</Text>
            </TouchableHighlight>
            {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
          </ScrollView>
        )
      }}
      </Mutation>

    )
  }
}

const CREATE_BOOK_MUTATION = gql`
  mutation AddBookToShelfMutation(
    $title: String!,
    $isbn: String! ) {
      addBooksToShelf(
        title: $title,
        isbn: $isbn ) {
          books {
            title
            isbn
          }
        }
      }`

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
