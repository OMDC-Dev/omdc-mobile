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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.mainContainer}>
        <Text style={styles.textTitle} variant={'headlineSmall'}>
          Pengajuan Reimbursement Berhasil!
        </Text>
        <LottieView
          source={ASSETS.animation.done2}
          style={{width: '60%', height: '60%'}}
          autoPlay
          loop
        />
      </View>
      <View style={styles.bottomContainer}>
        <Button onPress={() => navigation.navigate('Home')}>Selesai</Button>
      </View>
    </SafeAreaView>
  );
};

export default PengajuanDoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
