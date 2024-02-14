import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {HomeStack} from './HomeStack';
import HistoryScreen from '../screens/history';
import {Icon} from 'react-native-paper';
import {Colors} from '../styles';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {HistoryStack} from './HistoryStack';
import {DiajukanStack} from './DiajukanStack';
import {AuthContext} from '../context';
import {BarangStack} from './BarangNavigator';
import {cekAkses} from '../utils/utils';
import {FinanceStack} from './FinanceStack';
import {ProfileStack} from './ProfileStack';

const Tab = createBottomTabNavigator();

const MainStackNavigator = () => {
  const {user} = React.useContext(AuthContext);
  const hasRequestBarang = cekAkses('#2', user.kodeAkses);

  console.log(user.kodeAkses);

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({route}) => ({
        tabBarActiveTintColor: Colors.COLOR_PRIMARY,
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (
            routeName === 'Home' ||
            routeName === 'History' ||
            routeName === 'DiajukanInit' ||
            routeName === 'FinanceInit' ||
            routeName === 'Barang' ||
            routeName === 'ProfileInit' ||
            !routeName
          ) {
            return {display: 'flex', position: 'absolute'};
          } else {
            return {display: 'none', position: 'absolute'};
          }
        })(route),
      })}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: 'Reimbursement',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon source={'home-variant'} color={color} size={size} />
          ),
        }}
      />
      {user.isAdmin &&
        (user.type == 'ADMIN' ? (
          <Tab.Screen
            name="DiajukanStack"
            component={DiajukanStack}
            options={{
              title: 'Pengajuan',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon source={'clipboard-flow'} color={color} size={size} />
              ),
            }}
          />
        ) : (
          <Tab.Screen
            name="FiananceStack"
            component={FinanceStack}
            options={{
              title: 'Pengajuan',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon source={'clipboard-flow'} color={color} size={size} />
              ),
            }}
          />
        ))}
      <Tab.Screen
        name="HistoryStack"
        component={HistoryStack}
        options={{
          title: 'Riwayat Reimbursement',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon source={'clipboard-flow'} color={color} size={size} />
          ),
        }}
      />
      {hasRequestBarang && (
        <Tab.Screen
          name="BarangStack"
          component={BarangStack}
          options={{
            title: 'Permintaan Barang',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon source={'basket-unfill'} color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon source={'account'} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainStackNavigator;
