import { StyleSheet } from 'react-native'

const OXYGEN_MONO_REGULAR = 'OxygenMono-Regular'
const OXYGEN_REGULAR = 'Oxygen-Regular'
const OXYGEN_BOLD = 'Oxygen-Bold'
const BLUE_HEX = '#008B8B'
const BOOK_COLOR_HEX = '#22556E'
const LIGHT_GREEN_HEX = '#50CF88'
const WHITE = '#fff'

const CommonStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
      alignSelf:'stretch',
      marginTop: 50,
    },
    formContainer: {
      backgroundColor: WHITE,
      flex: 1,
      alignItems: 'stretch',
      padding: 20,
    },
    smallCreateButton: {
      alignSelf: 'center',
      borderRadius: 30,
      borderColor: BLUE_HEX,
      borderWidth: 2,
      width: 200,
      paddingVertical: 5,
      margin: 10,
    },
    smallCancelButton: {
      borderRadius: 30,
      borderColor: BLUE_HEX,
      borderWidth: 2,
      paddingHorizontal: 60,
      paddingVertical: 5,
      margin: 10,
    },
    cancelButton: {
      borderRadius: 30,
      borderColor: BLUE_HEX,
      borderWidth: 2,
      paddingHorizontal: 60,
      paddingVertical: 12,
      margin: 10,
    },
    button: {
      borderRadius: 30,
      backgroundColor: BLUE_HEX,
      paddingHorizontal: 60,
      paddingVertical: 12,
      marginHorizontal: 10,
      marginVertical: 10,
    },
    buttonText: {
      fontFamily: OXYGEN_REGULAR,
      color: WHITE,
      fontSize: 18,
      alignSelf: 'center',
    },
    buttonInverted: {
      paddingHorizontal: 60,
      paddingVertical: 12,
      marginHorizontal: 10,
      marginVertical: 10,
    },
    buttonTextInverted: {
      fontFamily: OXYGEN_BOLD,
      color: BLUE_HEX,
      fontSize: 18,
      alignSelf: 'center',
    },
    disabledButton: {
      borderRadius: 30,
      backgroundColor: BLUE_HEX,
      paddingHorizontal: 60,
      paddingVertical: 12,
      marginHorizontal: 10,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1},
      shadowOpacity: 0.2,
      opacity: 0.5
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
    },
    commonText: {
      fontFamily: OXYGEN_REGULAR,
      fontSize: 14,
      alignSelf: 'center'
    },
    screenTitle: {
      paddingTop: 20,
      fontFamily: OXYGEN_MONO_REGULAR,
      fontSize: 24,
      marginLeft: 20,
    },
    callToActionText: {
      fontFamily: OXYGEN_REGULAR,
      fontSize: 16,
      padding: 10,
      color: BLUE_HEX,
      alignSelf: 'center',
      justifyContent: 'center',
    },
})

module.exports = {
   OXYGEN_MONO_REGULAR: OXYGEN_MONO_REGULAR,
   OXYGEN_REGULAR: OXYGEN_REGULAR,
   OXYGEN_BOLD: OXYGEN_BOLD,
   BLUE_HEX: BLUE_HEX,
   LIGHT_GREEN_HEX: LIGHT_GREEN_HEX,
   CommonStyles: CommonStyles
}
