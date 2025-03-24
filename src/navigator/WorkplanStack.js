import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import WorkplanScreen from '../screens/workplan/createworkplan';

const Stack = createNativeStackNavigator();

export const WorkplanStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Workplan" component={WorkplanScreen} />
    </Stack.Navigator>
  );
};
