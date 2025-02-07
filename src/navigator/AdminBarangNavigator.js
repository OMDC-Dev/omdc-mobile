import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import PermintaanDetailScreen from '../screens/permintaandetail';
import PreviewScreen from '../screens/preview';
import AdminBarangScreen from '../screens/adminbarang';

//create stack screen
const Stack = createNativeStackNavigator();

export const AdminBarangStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AdminBarang" component={AdminBarangScreen} />
      <Stack.Screen name="BarangDetail" component={PermintaanDetailScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};
