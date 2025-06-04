import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {Container, Header} from '../../../components';
import {Colors, Size} from '../../../styles';
import ListPlaceholder from './ListPlaceholder';

const WorkplanListCCScreen = () => {
  // define tab
  const Tab = createMaterialTopTabNavigator();

  function renderTab() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.COLOR_SECONDARY,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
          },
          tabBarActiveTintColor: Colors.COLOR_WHITE,
          tabBarInactiveTintColor: Colors.COLOR_DARK_GRAY,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.COLOR_PRIMARY,
            height: 6,
          },
        }}>
        <Tab.Screen
          name="Diajukan"
          component={ListPlaceholder}
          initialParams={{
            type: 'WAITING',
            user: 'CC',
          }}
          options={{
            title: 'Dalam Proses',
          }}
        />
        <Tab.Screen
          name="Pending"
          component={ListPlaceholder}
          initialParams={{
            type: 'PENDING',
            user: 'CC',
          }}
          options={{
            title: 'Pending',
          }}
        />
        <Tab.Screen
          name="Duedate"
          component={ListPlaceholder}
          initialParams={{
            type: 'WAITING',
            user: 'CC',
            duedate: true,
          }}
          options={{
            title: 'Due Date',
          }}
        />
        <Tab.Screen
          name="Disetujui"
          component={ListPlaceholder}
          initialParams={{
            type: 'DONE',
            user: 'CC',
          }}
          options={{
            title: 'Selesai',
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <Header title={'Work in Progress'} />
      {renderTab()}
    </Container>
  );
};

export default WorkplanListCCScreen;
