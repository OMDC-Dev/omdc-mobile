import * as React from 'react';
import {View, Text, StatusBar, Image} from 'react-native';
import {AuthContext} from '../../context';
import {retrieveData} from '../../utils/store';
import {wait} from '../../utils/utils';
import styles from './styles';
import ASSETS from '../../utils/assetLoader';

const SplashScreen = () => {
  const {restoreToken} = React.useContext(AuthContext);

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
        source={ASSETS.logoDark}
      />
    </View>
  );
};

export default SplashScreen;
