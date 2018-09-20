import { StyleSheet } from 'react-native';

const OXYGEN_MONO_REGULAR = 'OxygenMono-Regular'
const OXYGEN_REGULAR = 'Oxygen-Regular'
const OXYGEN_BOLD = 'Oxygen-Bold'

const commonstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EDEEF3',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    formContainer: {
      backgroundColor: '#fff',
      flex: 1,
      alignItems: 'stretch',
      padding: 20,
    },
    cancelButton: {
      borderRadius: 30,
      borderColor: '#008B8B',
      borderWidth: 2,
      paddingHorizontal: 60,
      paddingVertical: 12,
      margin: 10,
    },
    button: {
      borderRadius: 30,
      backgroundColor: '#008B8B',
      paddingHorizontal: 60,
      paddingVertical: 12,
      marginHorizontal: 10,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1},
      shadowOpacity: 0.2

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
      fontFamily: OXYGEN_REGULAR,
      fontSize: 18,
      padding: 10,
      color: '#E83338',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      paddingTop: 100,
      fontFamily: OXYGEN_MONO_REGULAR,
      fontSize: 18,
      alignSelf: 'center'
    }
});

module.exports = {
   OXYGEN_MONO_REGULAR: OXYGEN_MONO_REGULAR,
   OXYGEN_REGULAR: OXYGEN_REGULAR,
   OXYGEN_BOLD: OXYGEN_BOLD,
   commonstyles: commonstyles
}
