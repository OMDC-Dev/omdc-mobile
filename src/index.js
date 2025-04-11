import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import AuthProvider from './context/AuthProvider';
import ModalProvider from './context/ModalProvider';
import {AuthStackNavigator} from './navigator';
import MainStackNavigator from './navigator/MainNavigator';
import SplashScreen from './screens/splash';
import {navigationRef} from './navigator/NotificationHandler';
import messaging from '@react-native-firebase/messaging';
import useAppReady from './hooks/useAppReady';
import {NotificationContext} from './context';

const App = () => {
  const {setRemoteNotif} = React.useContext(NotificationContext);

  useAppReady(navigationRef, setRemoteNotif);

  return (
    <NavigationContainer ref={navigationRef}>
      <ModalProvider>
        <AuthProvider>
          {state => {
            if (!state || state.isLoading) {
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
