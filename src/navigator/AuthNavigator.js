import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import LoginScreen from '../screens/login';
import UserCompleteScreen from '../screens/usercomplete';

//create stack screen
const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignIn" component={LoginScreen} />
      <Stack.Screen name="UserComplete" component={UserCompleteScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
