import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './store/reducers/';
import thunk from 'redux-thunk';

import { Ionicons } from '@expo/vector-icons';

import Mappa from './screens/Mappa';
import HeaderButton from './components/HeaderButton';

import DrawerContent from './components/DrawerContent';

const store = createStore(rootReducer, applyMiddleware(thunk));
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function tabMappa() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Mappa') {
            iconName = 'ios-home'
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: '#8ea6b4',
      }}
    >
      <Tab.Screen name="Mappa" component={MappaScreen} />
    </Tab.Navigator>
  );
}

function MappaScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mappa" component={Mappa} options={({ navigation }) => ({
        headerLeft: () => <HeaderButton onPressLeft={() => navigation.toggleDrawer()} />,
        title: 'DASHBOARD',
        headerTitleStyle: { fontWeight: 'bold' },
        headerStyle: {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }
      })} />
    </Stack.Navigator>
  );
}

function MainNavigation() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
        backgroundColor={Platform.OS === 'ios' ? null : 'white'}
        hidden={Platform.OS === 'ios' ? false : true}
      />
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Mappa" component={tabMappa} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainNavigation />
    </Provider>
  )
}
