/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  StyleSheet
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './App/screens/SplashScreen';
import Signup from './App/screens/Signup';
import Signin from './App/screens/Signin';
import EditProfile from './App/screens/EditProfile';
import Home from './App/screens/Home';
import Profile from './App/screens/Profile';
import PrivateMessages from './App/Components/PrivateMessages';
import GroupMessages from './App/Components/GroupMessages';
import ListTask from './App/Components/ListTask';
import Requests from './App/Components/Requests';
import AddGroup from './App/Components/AddGroup';
import Members from './App/Components/Members';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  render() {

    return (
      <>
        <View style={styles.container}>
          <StatusBar backgroundColor="#007591" />
          <SplashScreen navigation={this.props.navigation} />
        </View>
      </>
    );
  };
}

const Stack = createStackNavigator();

function Stacks() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="App"
        component={App}
        options={{
        headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signin"
        component={Signin}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Requests"
        component={Requests}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Members"
        component={Members}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Private"
        component={PrivateMessages}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GroupMessages"
        component={GroupMessages}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ListTask"
        component={ListTask}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddGroup"
        component={AddGroup}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function MainScreen() {
  return (
    <NavigationContainer>
      <Stacks />
    </NavigationContainer>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
  },
  logo: {
    height: 220,
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },
  btn: {
    width: '60%',
    height: 50,
    borderRadius: 20,
    backgroundColor: '#ff5b77',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    elevation: 15,
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
});