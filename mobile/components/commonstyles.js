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
      flex: 1,
      backgroundColor: 'rgba(52,52,52,0.8)',
      opacity: 0.7,
      alignItems: 'center'
    },
    modalContainer: {
      backgroundColor: '#fff',
      alignItems: 'stretch',
      marginTop: 200,
      marginHorizontal: 10,
      padding: 15,
      height: 400,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2},
      shadowOpacity: 0.5
    },
    modalTitle: {
      alignSelf: 'center',
      fontSize: 18,
      padding: 20,
      fontFamily: OXYGEN_BOLD
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
    cancelButtonText: {
      fontFamily: OXYGEN_REGULAR,
      color: '#008B8B',
      fontSize: 18,
      alignSelf: 'center',
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
    loadingText: {
      paddingTop: 100,
      fontFamily: OXYGEN_MONO_REGULAR,
      fontSize: 18,
      alignSelf: 'center'
    },
    camera: {
      alignSelf: 'center',
      height: 200,
      width: 200,
    }
});

export default commonstyles;
