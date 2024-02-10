import * as React from 'react';
import {View, Text} from 'react-native';
import {AuthContext} from '../../context';
import {retrieveData} from '../../utils/store';
import {wait} from '../../utils/utils';
import styles from './styles';

const SplashScreen = () => {
  const {restoreToken} = React.useContext(AuthContext);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await retrieveData('token', false);
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
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;
