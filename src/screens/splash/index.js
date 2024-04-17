import * as React from 'react';
import {View, Text, StatusBar, Image} from 'react-native';
import {AuthContext} from '../../context';
import {retrieveData, storeData} from '../../utils/store';
import {wait} from '../../utils/utils';
import styles from './styles';
import ASSETS from '../../utils/assetLoader';
import {fetchApi} from '../../api/api';
import {GET_ICON} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const SplashScreen = () => {
  const [icon, setIcon] = React.useState();
  const {restoreToken} = React.useContext(AuthContext);

  React.useEffect(() => {
    checkIcon();
  }, []);

  async function checkIcon() {
    const getIconLocal = await retrieveData('APP_ICON');

    if (getIconLocal) {
      setIcon(getIconLocal);
    }

    getIcon();
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
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await retrieveData('USER_SESSION', true);
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      restoreToken(userToken);
    };
    wait(2500).then(() => bootstrapAsync());
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
