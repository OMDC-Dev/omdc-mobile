import * as React from 'react';
import {View, Text, StatusBar, Image} from 'react-native';
import {AuthContext} from '../../context';
import {retrieveData, storeData} from '../../utils/store';
import {wait} from '../../utils/utils';
import styles from './styles';
import ASSETS from '../../utils/assetLoader';
import {fetchApi} from '../../api/api';
import {
  APP_CODE_VERSION,
  BASE_URL,
  GET_ICON,
  UPDATE_USER_FCM,
  USER_KODE_AKSES,
  USER_STATUS,
} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import ModalView from '../../components/modal';
import {Colors} from '../../styles';
import messaging from '@react-native-firebase/messaging';

const SplashScreen = () => {
  const [icon, setIcon] = React.useState();
  const {restoreToken, signOut} = React.useContext(AuthContext);
  const [errorType, setErrorType] = React.useState();
  const [showAlert, setShowAlert] = React.useState(false);
  const CODE_VERSION = APP_CODE_VERSION;

  const IS_PROD = BASE_URL.includes('server.omdc');

  async function checkIcon() {
    try {
      const getIconLocal = await retrieveData('APP_ICON');

      if (getIconLocal) {
        setIcon(getIconLocal);
      }

      getIcon();
    } catch (error) {
      getIcon();
    }
  }

  async function getIcon() {
    const {state, data, error} = await fetchApi({url: GET_ICON, method: 'GET'});

    if (state == API_STATES.OK) {
      console.log('GET ICON SUCCESS');
      setIcon(data.iconMobile);
      storeData('APP_ICON', data.iconMobile);
    }
  }

  React.useEffect(() => {
    checkIcon();
    checkVersion();

    return () => null;
  }, []);

  async function getUserStatus(id) {
    const {state, data, error} = await fetchApi({
      url: USER_STATUS(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      console.log('User Status XX', data);
      return data;
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    let user;
    let statusUser;

    try {
      user = await retrieveData('USER_SESSION', true);

      if (user) {
        const getUserSession = await getUserStatus(user.iduser);

        if (getUserSession) {
          statusUser = getUserSession.status;
        }

        const {state, data, error} = await fetchApi({
          url: USER_KODE_AKSES(user.iduser),
          method: 'GET',
        });

        if (state == API_STATES.OK) {
          console.log('UPDATE KODE AKSES', data.kodeAkses);
          user = {
            ...user,
            kodeAkses: data.kodeAkses,
            isAdmin: getUserSession.isAdmin,
            type: getUserSession.type,
          };

          console.log('Updated User', user);
        }

        // on refresh token
        messaging().onTokenRefresh(token => onUserFCMUpdate(token));
      }
    } catch (e) {
      // Restoring token failed
    }

    console.log('User Status', statusUser);

    wait(1500).then(() => restoreToken(statusUser == 'Aktif' ? user : null));
  };

  async function onUserFCMUpdate(token) {
    const {state, data, error} = await fetchApi({
      url: UPDATE_USER_FCM,
      method: 'POST',
      body: {
        newToken: token,
      },
    });

    if (state == API_STATES.OK) {
      console.log('User FCM Updated!');
    }
  }

  async function checkVersion() {
    const {state, data, error} = await fetchApi({
      url: `/version/${CODE_VERSION}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      bootstrapAsync();
    } else {
      setShowAlert(true);
      setErrorType(error);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        resizeMode={'contain'}
        style={styles.logo}
        source={icon ? {uri: `data:image/png;base64,${icon}`} : ASSETS.logoDark}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
        }}>
        <Text
          style={{
            color: Colors.COLOR_WHITE,
            fontSize: 12,
          }}>
          {IS_PROD ? 'Prod' : 'Dev'} {APP_CODE_VERSION}
        </Text>
      </View>
      <ModalView data={errorType} visible={showAlert} type={'version'} />
    </View>
  );
};

export default SplashScreen;
