import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import {HomeStack} from './HomeStack';
import {Icon} from 'react-native-paper';
import {Colors} from '../styles';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {DiajukanStack} from './DiajukanStack';
import {AuthContext} from '../context';
import {BarangStack} from './BarangNavigator';
import {cekAkses} from '../utils/utils';
import {FinanceStack} from './FinanceStack';
import {ProfileStack} from './ProfileStack';
import {SuperReimbursementStack} from './ReportReimbursement';
import {ReviewerStack} from './ReviewerStack';
import {MakerStack} from './MakerStack';
import {AdminBarangStack} from './AdminBarangNavigator';

const Tab = createBottomTabNavigator();

const MainStackNavigator = () => {
  const {user} = React.useContext(AuthContext);
  const hasRequestBarang = cekAkses('#2', user.kodeAkses);
  const isAdminPB = cekAkses('#8', user.kodeAkses);
  const hasSuperReimbursement = cekAkses('#5', user.kodeAkses);

  console.log('NAV USER TYPE', user);

  // select admin type
  function renderAdminPengajuan() {
    let screen;

    switch (user.type) {
      case 'ADMIN':
        screen = (
          <Tab.Screen
            name="DiajukanStack"
            component={DiajukanStack}
            options={{
              title: 'Acc ROP',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon source={'clipboard-flow'} color={color} size={size} />
              ),
            }}
          />
        );
        break;
      case 'FINANCE':
        screen = (
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
        );
        break;
      case 'REVIEWER':
        screen = (
          <Tab.Screen
            name="DiajukanStack"
            component={ReviewerStack}
            options={{
              title: 'Pengajuan',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon source={'clipboard-flow'} color={color} size={size} />
              ),
            }}
          />
        );
        break;
      case 'MAKER':
        screen = (
          <Tab.Screen
            name="DiajukanStack"
            component={MakerStack}
            options={{
              title: 'Pengajuan',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon source={'clipboard-flow'} color={color} size={size} />
              ),
            }}
          />
        );
        break;
      default:
        screen = null;
        break;
    }

    return user.isAdmin ? screen : null;
  }

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({route}) => ({
        unmountOnBlur: true,
        tabBarActiveTintColor: Colors.COLOR_PRIMARY,
        tabBarHideOnKeyboard: true,
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          if (
            routeName === 'Home' ||
            routeName === 'History' ||
            routeName === 'DiajukanInit' ||
            routeName === 'FinanceInit' ||
            routeName === 'Barang' ||
            routeName === 'AdminBarang' ||
            routeName === 'SuperReimbursementInit' ||
            routeName === 'ProfileInit' ||
            routeName === 'ReviewerInit' ||
            routeName === 'MakerInit' ||
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
          title: 'R.O.P',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon source={'home-variant'} color={color} size={size} />
          ),
        }}
      />
      {renderAdminPengajuan()}
      {/* Permintaan Barang Stack */}
      {hasRequestBarang && (
        <Tab.Screen
          name="BarangStack"
          component={BarangStack}
          options={{
            title: 'PB',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon source={'basket-unfill'} color={color} size={size} />
            ),
          }}
        />
      )}
      {isAdminPB && (
        <Tab.Screen
          name="AdminBarangStack"
          component={AdminBarangStack}
          options={{
            title: 'Acc PB',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon source={'basket-unfill'} color={color} size={size} />
            ),
          }}
        />
      )}
      {hasSuperReimbursement && (
        <Tab.Screen
          name="SuperReimbursementStack"
          component={SuperReimbursementStack}
          options={{
            title: 'Report',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon source={'clipboard-flow'} color={color} size={size} />
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
