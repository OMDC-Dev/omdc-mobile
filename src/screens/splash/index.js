import * as React from 'react';
import {View, Text, StatusBar, Image} from 'react-native';
import {AuthContext} from '../../context';
import {retrieveData, storeData} from '../../utils/store';
import {wait} from '../../utils/utils';
import styles from './styles';
import ASSETS from '../../utils/assetLoader';
import {fetchApi} from '../../api/api';
import {GET_ICON, USER_KODE_AKSES, USER_STATUS} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import ModalView from '../../components/modal';

const SplashScreen = () => {
  const [icon, setIcon] = React.useState();
  const {restoreToken, signOut} = React.useContext(AuthContext);
  const [errorType, setErrorType] = React.useState();
  const [showAlert, setShowAlert] = React.useState(false);
  const CODE_VERSION = '9.6.0';

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
      return data.status;
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  const bootstrapAsync = async () => {
    let user;
    let statusUser;

    try {
      user = await retrieveData('USER_SESSION', true);

      if (user) {
        statusUser = await getUserStatus(user.iduser);

        const {state, data, error} = await fetchApi({
          url: USER_KODE_AKSES(user.iduser),
          method: 'GET',
        });

        if (state == API_STATES.OK) {
          console.log('UPDATE KODE AKSES', data.kodeAkses);
          user = {...user, kodeAkses: data.kodeAkses};
        }
      }
    } catch (e) {
      // Restoring token failed
    }

    console.log('User Status', statusUser);

    wait(1500).then(() => restoreToken(statusUser == 'Aktif' ? user : null));
  };

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
      <ModalView data={errorType} visible={showAlert} type={'version'} />
    </View>
  );
};

export default SplashScreen;
