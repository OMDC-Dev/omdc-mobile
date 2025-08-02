import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import BarangScreen from '../screens/barang';
import BarangRequestScreen from '../screens/barangrequest';
import BarangCariScreen from '../screens/caribarang';
import BarangListScreen from '../screens/baranglist';
import PermintaanDetailScreen from '../screens/permintaandetail';
import PreviewScreen from '../screens/preview';
import PermintaanDetailDownloadScreen from '../screens/permintaandetaildownload';
import MasterBarangAddScreen from '../screens/masterbarangadd';
import AllBarangRequestedScreen from '../screens/allbarangrequested';

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
      <Stack.Screen
        name="BarangDownload"
        component={PermintaanDetailDownloadScreen}
      />
      <Stack.Screen name="BarangRequest" component={BarangRequestScreen} />
      <Stack.Screen name="BarangList" component={BarangListScreen} />
      <Stack.Screen name="BarangCari" component={BarangCariScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="MasterBarangAdd" component={MasterBarangAddScreen} />
      <Stack.Screen
        name="BarangRequestedAll"
        component={AllBarangRequestedScreen}
      />
    </Stack.Navigator>
  );
};
