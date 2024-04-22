import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import ASSETS from '../../utils/assetLoader';
import {Button} from '../../components';
import {Size} from '../../styles';
import {useNavigation} from '@react-navigation/native';

const PengajuanDoneScreen = () => {
  const navigation = useNavigation();

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
            navigation.navigate('Home', {
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
});
