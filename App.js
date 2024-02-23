import React from 'react';
import Main from './src';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {Colors} from './src/styles';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.COLOR_PRIMARY,
    secondary: Colors.COLOR_SECONDARY,
  },
};

const App = () => {
  async function requestUserPermission() {
    if (Platform.OS == 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  // request permission
  React.useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Main />
    </PaperProvider>
  );
};

export default App;
