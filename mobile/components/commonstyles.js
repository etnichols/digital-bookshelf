import { StyleSheet } from 'react-native';

const commonstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      fontFamily: 'Oxygen-Regular',
      color: '#fff',
      fontSize: 18,
      alignSelf: 'center',
    },
    header: {
      paddingTop: 120,
      fontFamily: 'OxygenMono-Regular',
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
