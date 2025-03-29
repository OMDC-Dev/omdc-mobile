import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import AuthProvider from './context/AuthProvider';
import ModalProvider from './context/ModalProvider';
import {AuthStackNavigator} from './navigator';
import MainStackNavigator from './navigator/MainNavigator';
import SplashScreen from './screens/splash';
import {navigationRef} from './navigator/NotificationHandler';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  React.useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notifikasi diklik saat aplikasi di background:',
        remoteMessage,
      );
      if (remoteMessage.data?.name) {
        navigationRef.current?.navigate(remoteMessage.data.name, {
          ...remoteMessage.data,
          params: JSON.parse(remoteMessage.data?.params),
        });
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notifikasi diklik saat aplikasi tertutup:',
            remoteMessage,
          );
          if (remoteMessage.data?.name) {
            navigationRef.current?.navigate(remoteMessage.data.name, {
              ...remoteMessage.data,
              params: JSON.parse(remoteMessage.data?.params),
            });
          }
        }
      });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
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
