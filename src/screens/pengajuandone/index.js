import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import ASSETS from '../../utils/assetLoader';
import {Button} from '../../components';
import {Colors, Size} from '../../styles';
import {useNavigation, useRoute} from '@react-navigation/native';

const PengajuanDoneScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const DATA = route.params?.data;

  console.log('SUCCESS EXT', DATA);

  function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.mainContainer}>
        <Text style={styles.textTitle} variant={'headlineSmall'}>
          Pengajuan Request of Payment Berhasil!
        </Text>
        <Text style={styles.textSubtitle} variant={'titleMedium'}>
          Nomor Pengajuan:{' '}
          <Text style={{fontWeight: 'bold', color: Colors.COLOR_PRIMARY}}>
            {DATA.no_doc}
          </Text>
        </Text>
        <LottieView
          source={ASSETS.animation.done2}
          style={{width: '60%', height: '60%'}}
          autoPlay
          loop
        />
      </View>
      <View style={styles.bottomContainer}>
        <Button
          onPress={() =>
            navigation.navigate('PengajuanList', {
              refresh: generateRandomInteger(10, 9999),
            })
          }>
          Selesai
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PengajuanDoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Size.SIZE_14,
  },

  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomContainer: {
    paddingHorizontal: Size.SIZE_14,
  },

  // text
  textTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // text
  textSubtitle: {
    marginTop: Size.SIZE_14,
    textAlign: 'center',
  },
});
