import * as React from 'react';
import {View, StyleSheet, BackHandler, Linking} from 'react-native';
import {Colors, Scaler, Size} from '../../../../styles';
import {Button, Text} from 'react-native-paper';
import Gap from '../../../Gap';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNExitApp from 'react-native-exit-app';

const ModalPopUpVersion = ({error}) => {
  const handleUpdatePress = () => {
    const androidUrl =
      'https://play.google.com/store/apps/details?id=com.ardclient.omdc'; // ganti dengan URL aplikasi Anda di Play Store
    const iosUrl = 'https://apps.apple.com/us/app/omdc-mobile/id6479362002'; // ganti dengan URL aplikasi Anda di App Store

    const url = Platform.OS === 'android' ? androidUrl : iosUrl;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <Gap h={14} />
      <Icon name={'alert-outline'} size={32} color={Colors.COLOR_ORANGE} />
      <Gap h={14} />
      <Text variant={'labelMedium'} style={styles.textMessage}>
        {error == 'UPDATE'
          ? 'Update versi aplikasi tersedia, mohon lakukan update agar bisa kembali menggunakan aplikasi ini.'
          : 'Ada kesalahan jaringan, mohon coba lagi!'}
      </Text>
      <Gap h={24} />
      <Button
        onPress={() =>
          error == 'UPDATE' ? handleUpdatePress() : RNExitApp.exitApp()
        }>
        {error == 'UPDATE' ? 'Update' : 'Ok'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Size.SIZE_12,
    paddingHorizontal: Size.SIZE_18,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 8,
    maxWidth: '80%',
  },

  textMessage: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ModalPopUpVersion;
