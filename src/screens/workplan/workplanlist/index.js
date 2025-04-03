import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {Container, Header} from '../../../components';
import {Colors, Size} from '../../../styles';
import ListPlaceholder from './ListPlaceholder';

const WorkplanListScreen = () => {
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
            user: 'USER',
          }}
          options={{
            title: 'Dalam Proses',
          }}
        />
        <Tab.Screen
          name="Disetujui"
          component={ListPlaceholder}
          initialParams={{
            type: 'DONE',
            user: 'USER',
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
      <Header title={'Work Plan'} />
      {renderTab()}
    </Container>
  );
};

export default WorkplanListScreen;
