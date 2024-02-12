import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import BarangScreen from '../screens/barang';
import BarangRequestScreen from '../screens/barangrequest';
import BarangCariScreen from '../screens/caribarang';
import BarangListScreen from '../screens/baranglist';
import PermintaanDetailScreen from '../screens/permintaandetail';

//create stack screen
const Stack = createNativeStackNavigator();

export const BarangStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Barang" component={BarangScreen} />
      <Stack.Screen name="BarangDetail" component={PermintaanDetailScreen} />
      <Stack.Screen name="BarangRequest" component={BarangRequestScreen} />
      <Stack.Screen name="BarangList" component={BarangListScreen} />
      <Stack.Screen name="BarangCari" component={BarangCariScreen} />
    </Stack.Navigator>
  );
};
