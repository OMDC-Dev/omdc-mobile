import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import HistoryScreen from '../screens/history';
import PengajuanDetailScreen from '../screens/pengajuandetail';
import PreviewScreen from '../screens/preview';

const Stack = createNativeStackNavigator();

export const HistoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PengajuanStack"
        component={PengajuanStack}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const PengajuanStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PengajuanDetail" component={PengajuanDetailScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};
