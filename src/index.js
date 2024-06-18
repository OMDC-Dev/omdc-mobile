import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './screens/splash';
import {AuthStackNavigator} from './navigator';
import MainStackNavigator from './navigator/MainNavigator';
import AuthProvider from './context/AuthProvider';
import ModalProvider from './context/ModalProvider';

const App = () => {
  return (
    <NavigationContainer>
      <ModalProvider>
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
      </ModalProvider>
    </NavigationContainer>
  );
};

export default App;
