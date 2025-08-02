import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import ProfileScreen from '../screens/profile';
import UpdatePasswordScreen from '../screens/updatepassword';
import UserCompleteScreen from '../screens/usercomplete';
import {BarangStack} from './BarangNavigator';

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
      <Stack.Screen
        name="MasterBarang"
        component={BarangStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
