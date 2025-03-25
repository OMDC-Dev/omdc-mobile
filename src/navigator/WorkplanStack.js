import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import WorkplanScreen from '../screens/workplan/createworkplan';
import PreviewScreen from '../screens/preview';
import WorkplanListScreen from '../screens/workplan/workplanlist';
import WorkplanDoneScreen from '../screens/workplan/workplandone';

const Stack = createNativeStackNavigator();

export const WorkplanStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="WorkplanList" component={WorkplanListScreen} />
      <Stack.Screen name="Workplan" component={WorkplanScreen} />
      <Stack.Screen name="WorkplanDone" component={WorkplanDoneScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};
