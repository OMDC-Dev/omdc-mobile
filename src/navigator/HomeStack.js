import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import HomeScreen from '../screens/home';
import PengajuanScreen from '../screens/pengajuan';
import PengajuanBankScreen from '../screens/pengajuanbank';
import PengajuanDoneScreen from '../screens/pengajuandone';
import PengajuanDetailScreen from '../screens/pengajuandetail';
import PreviewScreen from '../screens/preview';
import PengajuanItemScreen from '../screens/pengajuanitem';
import NotifikasiScreen from '../screens/notifikasi';
import BuatNotifikasiScreen from '../screens/buatnotifikasi';
import {HistoryStack} from './HistoryStack';
import PengajuanListScreen from '../screens/pengajuanlist';
import {DiajukanStack} from './DiajukanStack';
import {ReviewerStack} from './ReviewerStack';
import {MakerStack} from './MakerStack';
import {FinanceStack} from './FinanceStack';
import {BarangStack} from './BarangNavigator';
import {AdminBarangStack} from './AdminBarangNavigator';
import {SuperReimbursementStack} from './ReportReimbursement';
import {WorkplanStack} from './WorkplanStack';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AdminStack" component={DiajukanStack} />
      <Stack.Screen name="ReviewerStack" component={ReviewerStack} />
      <Stack.Screen name="MakerStack" component={MakerStack} />
      <Stack.Screen name="FinanceStack" component={FinanceStack} />
      <Stack.Screen name="SuperROPStack" component={SuperReimbursementStack} />
      <Stack.Screen name="BarangStack" component={BarangStack} />
      <Stack.Screen name="AdminBarangStack" component={AdminBarangStack} />
      <Stack.Screen name="PengajuanStack" component={PengajuanStack} />
      <Stack.Screen name="NotifikasiStack" component={NotifStack} />
      <Stack.Screen name="HistoryReimbursementStack" component={HistoryStack} />
      <Stack.Screen name="WorkplanStack" component={WorkplanStack} />
    </Stack.Navigator>
  );
};

const PengajuanStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PengajuanList"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PengajuanList" component={PengajuanListScreen} />
      <Stack.Screen name="Pengajuan" component={PengajuanScreen} />
      <Stack.Screen name="PengajuanItem" component={PengajuanItemScreen} />
      <Stack.Screen name="PengajuanBank" component={PengajuanBankScreen} />
      <Stack.Screen name="PengajuanDone" component={PengajuanDoneScreen} />
      <Stack.Screen name="PengajuanDetail" component={PengajuanDetailScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};

const NotifStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Notifikasi" component={NotifikasiScreen} />
      <Stack.Screen name="BuatNotifikasi" component={BuatNotifikasiScreen} />
    </Stack.Navigator>
  );
};
