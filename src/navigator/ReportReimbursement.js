import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import SuperReimbursementScreen from '../screens/superreimbursement';
import SuperReimbursementListScreen from '../screens/superreimbursementlist';
import PengajuanDetailScreen from '../screens/pengajuandetail';
import PreviewScreen from '../screens/preview';

const Stack = createNativeStackNavigator();

export const SuperReimbursementStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SuperReimbursementInit"
        component={SuperReimbursementScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SuperReimbursementList"
        component={SuperReimbursementListScreen}
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
      <Stack.Screen name="ReportDownload" component={PengajuanDetailScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};
