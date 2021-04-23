import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar } from 'react-native';
import DrawerContent from './components/DrawerContent';
import HeaderButton from './components/HeaderButton';
import Mappa from './screens/Mappa';

import { Root, Popup } from 'popup-ui';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
/*
function tabMappa() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Mappa') {
            iconName = 'ios-map'
          } else if (route.name === 'MappaDinamica') {
            iconName = 'ios-search'
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
      <Tab.Screen name="MappaDinamica" component={MappaDinamicaScreen} />
    </Tab.Navigator>
  );
}
*/
function MappaScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mappa" component={Mappa} options={({ navigation }) => ({
        headerLeft: () => <HeaderButton onPressLeft={() => navigation.toggleDrawer()} />,
        title: 'MAPPA',
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
/*
function MappaDinamicaScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MappaDinamica" component={MappaDinamica} options={({ navigation }) => ({
        headerLeft: () => <HeaderButton onPressLeft={() => navigation.toggleDrawer()} />,
        title: 'MAPPA',
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
*/
function MainNavigation() {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'}
        backgroundColor={Platform.OS === 'ios' ? null : 'white'}
        hidden={Platform.OS === 'ios' ? false : true}
      />
      <Drawer.Navigator initialRouteName="Home" drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Mappa" component={MappaScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Root>
      <MainNavigation />
    </Root>
  )
}
