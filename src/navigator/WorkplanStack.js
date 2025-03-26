import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import WorkplanScreen from '../screens/workplan/createworkplan';
import PreviewScreen from '../screens/preview';
import WorkplanListScreen from '../screens/workplan/workplanlist';
import WorkplanDoneScreen from '../screens/workplan/workplandone';
import WorkplanDetailScreen from '../screens/workplan/workplandetail';
import ProgressModal from '../screens/workplan/modal/ProgressModal';
import HistoryTanggalModal from '../screens/workplan/modal/HistoryTanggalModal';

const Stack = createNativeStackNavigator();

export const WorkplanStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="WorkplanList" component={WorkplanListScreen} />
      <Stack.Screen name="Workplan" component={WorkplanScreen} />
      <Stack.Screen name="WorkplanDetail" component={WorkplanDetailScreen} />
      <Stack.Screen name="WorkplanDone" component={WorkplanDoneScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />

      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="WPProgressModal" component={ProgressModal} />
        <Stack.Screen name="WPHistoryModal" component={HistoryTanggalModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
