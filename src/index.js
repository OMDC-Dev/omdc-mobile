import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './screens/splash';
import {AuthStackNavigator} from './navigator';
import MainStackNavigator from './navigator/MainNavigator';
import AuthProvider from './context/AuthProvider';
import ModalProvider from './context/ModalProvider';
import SnackBarProvider from './context/SnackbarProvider';

const App = () => {
  return (
    <NavigationContainer>
      <ModalProvider>
        <SnackBarProvider>
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
        </SnackBarProvider>
      </ModalProvider>
    </NavigationContainer>
  );
};

export default App;
