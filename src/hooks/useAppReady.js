import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';

const useAppReady = (navigationRef, setState) => {
  // Dapatkan notifikasi saat app ditutup
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '\x1b[32m%s\x1b[0m',
            'Hit API -> ',
            'Notifikasi diklik saat app tertutup:',
            remoteMessage,
          );
          //setInitialNotification(remoteMessage);
          setState(remoteMessage);
        }
      });
  }, []);

  // Handle notifikasi dari background
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notifikasi diklik saat app background:', remoteMessage);
      if (remoteMessage?.data?.name) {
        navigationRef.current?.navigate(remoteMessage.data.name, {
          ...remoteMessage.data,
          params: JSON.parse(remoteMessage.data?.params),
        });
      }
    });

    return unsubscribe;
  }, [navigationRef]);

  //   // Navigasi setelah semua siap
  //   useEffect(() => {
  //     if (
  //       initialNotification &&
  //       navigatorReady &&
  //       !handledInitialNotification.current &&
  //       initialNotification.data?.name
  //     ) {
  //       navigationRef.current?.navigate(initialNotification.data.name, {
  //         ...initialNotification.data,
  //         params: JSON.parse(initialNotification.data?.params),
  //       });
  //       handledInitialNotification.current = true;
  //     }
  //   }, [initialNotification, navigatorReady, navigationRef]);
};

export default useAppReady;
