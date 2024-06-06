import * as React from 'react';
import {View, Text, StatusBar, Image} from 'react-native';
import {AuthContext} from '../../context';
import {retrieveData, storeData} from '../../utils/store';
import {wait} from '../../utils/utils';
import styles from './styles';
import ASSETS from '../../utils/assetLoader';
import {fetchApi} from '../../api/api';
import {GET_ICON, USER_KODE_AKSES} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const SplashScreen = () => {
  const [icon, setIcon] = React.useState();
  const {restoreToken} = React.useContext(AuthContext);

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
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let user;

      try {
        user = await retrieveData('USER_SESSION', true);

        const {state, data, error} = await fetchApi({
          url: USER_KODE_AKSES(user.iduser),
          method: 'GET',
        });

        if (state == API_STATES.OK) {
          console.log('UPDATE KODE AKSES', data.kodeAkses);
          user = {...user, kodeAkses: data.kodeAkses};
        }
      } catch (e) {
        // Restoring token failed
      }

      restoreToken(user);
    };
    wait(2500).then(() => bootstrapAsync());

    return () => null;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        resizeMode={'contain'}
        style={styles.logo}
        source={icon ? {uri: `data:image/png;base64,${icon}`} : ASSETS.logoDark}
      />
    </View>
  );
};

export default SplashScreen;
