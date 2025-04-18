import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import HelpScreen from "./screens/HelpScreen";
import DetailScreen from "./screens/DetailScreen";
import Login from "./screens/Login";
import Signup from "./screens/Signup";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const HomeTabs = () =>{
  return(
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor:'blue',
        tabBarInactiveTintColor:'grey',
        tabBarStyle:{height:60},
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen}/>
      <Tabs.Screen name="Help" component={HelpScreen}/>
    </Tabs.Navigator>
  );
};

const App = () =>{
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="HomeTabs" component={HomeTabs}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Details" component={DetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App