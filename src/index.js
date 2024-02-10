import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './screens/splash';
import {AuthStackNavigator} from './navigator';
import MainStackNavigator from './navigator/MainNavigator';
import AuthProvider from './context/AuthProvider';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        {state => {
          if (state.isLoading) {
            return <SplashScreen />;
          }

          if (!state.userToken) {
            return <AuthStackNavigator />;
          }

          return <MainStackNavigator />;
        }}
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
