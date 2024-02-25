import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import ProfileScreen from '../screens/profile';
import UpdatePasswordScreen from '../screens/updatepassword';
import UserCompleteScreen from '../screens/usercomplete';

const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileInit"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdatePassword"
        component={UpdatePasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdateUser"
        component={UserCompleteScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
