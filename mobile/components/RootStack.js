import  gql from 'graphql-tag'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { DrawerItems, SafeAreaView, createBottomTabNavigator, createDrawerNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation'

import AuthLoadingScreen from './AuthLoadingScreen'
import Bookshelf from './Bookshelf'
import CreateAccount from './CreateAccount'
import ConfirmAccount from './ConfirmAccount'
import Inbox from './Inbox'
import Launch from './Launch'
import LoginForm from './LoginForm'
import Profile from './Profile'

import { LIGHT_GREEN_HEX } from './CommonStyles'

const AuthStack = createStackNavigator({
  Launch: {
    screen: Launch
  },
  CreateAccount: {
    screen: CreateAccount
  },
  ConfirmAccount: {
    screen: ConfirmAccount
  }
},
{
  initialRouteName: 'Launch',
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#008B8B',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  },
})

const AppTabNavigator = createBottomTabNavigator({
  Bookshelf: {
    screen: Bookshelf
  },
  Inbox: {
    screen: Inbox
  },
  Profile: {
    screen: Profile
  },
},{
  initialRouteName: 'Bookshelf',
  tabBarOptions: {
    showLabel: false,
    activeBackgroundColor: LIGHT_GREEN_HEX,
  }
})

const RootStack = createSwitchNavigator({
  App: { screen: AppTabNavigator },
  Auth: { screen: AuthStack },
  AuthLoading: { screen: AuthLoadingScreen }
}, {
  initialRouteName: 'AuthLoading'
})

export default RootStack
