import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Header} from '../../components';
import Pdf from 'react-native-pdf';
import {useRoute} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {ActivityIndicator} from 'react-native-paper';

const PreviewScreen = () => {
  const route = useRoute();

  const {file, type} = route.params;

  function isImageUrl(str) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    return urlPattern.test(str);
  }

  function loadImage() {
    const isUrl = isImageUrl(file);
    return isUrl ? file : `data:image/png;base64,${file}`;
  }

  console.log('FILE TYPE', type);

  return (
    <View style={styles.container}>
      <Header title={' '} />
      <View style={styles.mainContainer}>
        {type == 'application/pdf' ? (
          <>
            <Pdf
              source={{
                uri: file,
                cache: true,
              }}
              trustAllCerts={false}
              style={styles.pdf}
              renderActivityIndicator={() => {
                return <ActivityIndicator />;
              }}
            />
          </>
        ) : (
          <ImageViewer
            imageUrls={[
              {
                url: loadImage(),
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                props: {
                  resizeMode: 'contain',
                },
              },
            ]}
            renderIndicator={() => null}
            style={styles.imageViewer}
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
    backgroundColor: Colors.COLOR_BLACK,
    padding: Size.SIZE_14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  imageViewer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
