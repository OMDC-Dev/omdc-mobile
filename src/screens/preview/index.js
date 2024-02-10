import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Header} from '../../components';
import Pdf from 'react-native-pdf';
import {useRoute} from '@react-navigation/native';

const PreviewScreen = () => {
  const route = useRoute();

  const {file, type} = route.params;

  return (
    <View style={styles.container}>
      <Header title={' '} />
      <View style={styles.mainContainer}>
        {type == 'application/pdf' ? (
          <Pdf
            source={{
              uri: `data:application/pdf;base64,${file}`,
              cache: true,
            }}
            style={styles.pdf}
          />
        ) : (
          <Image
            source={{uri: `data:image/png;base64,${file}`}}
            style={styles.pdf}
            resizeMode={'contain'}
          />
        )}
      </View>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingTop: Platform.OS == 'ios' ? Scaler.scaleSize(38) : 0,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
