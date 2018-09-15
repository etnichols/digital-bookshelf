import { StyleSheet } from 'react-native';

const commonstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      borderRadius: 30,
      backgroundColor: '#008B8B',
      paddingHorizontal: 30,
      paddingVertical: 10,
      margin: 5,
    },
    buttonText: {
      fontFamily: 'Oxygen-Regular',
      color: '#fff',
      fontSize: 18,
    },
    header: {
      paddingTop: 40,
      fontFamily: 'OxygenMono-Regular',
      fontSize: 32,
    },
    loginContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 100,
    }
});

export default commonstyles;
