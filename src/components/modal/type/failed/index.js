import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, Scaler, Size} from '../../../../styles';
import {Button, Text} from 'react-native-paper';
import Gap from '../../../Gap';
import LottieView from 'lottie-react-native';
import ASSETS from '../../../../utils/assetLoader';

const ModalFailed = ({onButtonPress}) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={ASSETS.animation.failed2}
        style={{width: Scaler.scaleSize(125), height: Scaler.scaleSize(125)}}
        autoPlay
        loop
      />
      <Gap h={14} />
      <Text variant={'labelMedium'} style={styles.textMessage}>
        Aksi anda gagal dilakukan, mohon coba lagi!
      </Text>
      <Gap h={24} />
      <Button onPress={onButtonPress}>Ok</Button>
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
  },
});

export default ModalFailed;
