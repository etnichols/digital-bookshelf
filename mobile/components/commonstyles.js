import { StyleSheet } from 'react-native';

const OXYGEN_MONO_REGULAR = 'OxygenMono-Regular'
const OXYGEN_REGULAR = 'Oxygen-Regular'
const OXYGEN_BOLD = 'Oxygen-Bold'

const commonstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modal: {
      alignItems: 'center'
    },
    modalContainer: {
      backgroundColor: '#fff',
      alignItems: 'stretch',
      marginTop: 200,
      marginHorizontal: 10,
      padding: 10,
      height: 400,
    },
    modalTitle: {
      alignSelf: 'center',
      fontSize: 18,
      padding: 20,
      fontFamily: OXYGEN_REGULAR
    },
    formContainer: {
      backgroundColor: '#fff',
      flex: 1,
      alignItems: 'stretch',
      padding: 20,
    },
    button: {
      borderRadius: 30,
      backgroundColor: '#008B8B',
      paddingHorizontal: 60,
      paddingVertical: 12,
      margin: 10,
    },
    buttonText: {
      fontFamily: OXYGEN_REGULAR,
      color: '#fff',
      fontSize: 18,
      alignSelf: 'center',
    },
    header: {
      paddingTop: 120,
      fontFamily: OXYGEN_MONO_REGULAR,
      fontSize: 32,
    },
    loginContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 100,
    },
    errorText: {
      padding: 20,
      color: 'red',
      alignSelf: 'center',
    },
});

export default commonstyles;
