import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import HistoryScreen from '../screens/history';
import PengajuanDetailScreen from '../screens/pengajuandetail';
import PreviewScreen from '../screens/preview';
import PengajuanScreen from '../screens/pengajuan';
import PengajuanItemScreen from '../screens/pengajuanitem';
import PengajuanBankScreen from '../screens/pengajuanbank';
import PengajuanDoneScreen from '../screens/pengajuandone';

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
      <Stack.Screen name="Pengajuan" component={PengajuanScreen} />
      <Stack.Screen name="PengajuanItem" component={PengajuanItemScreen} />
      <Stack.Screen name="PengajuanBank" component={PengajuanBankScreen} />
      <Stack.Screen name="PengajuanDone" component={PengajuanDoneScreen} />
      <Stack.Screen name="PengajuanDetail" component={PengajuanDetailScreen} />
      <Stack.Screen name="ReportDownload" component={PengajuanDetailScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};
