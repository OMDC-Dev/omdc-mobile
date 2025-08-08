import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Header} from '../../components';
import Pdf from 'react-native-pdf';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ActivityIndicator, Text, TextInput} from 'react-native-paper';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import {isValidUrl} from '../../utils/utils';

const PreviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [caption, setCaption] = React.useState();

  const {file, type} = route.params;
  const SELECTED_CAPTION = route.params?.caption;
  const EXISTING_PARAMS = route.params?.existingParams;
  const CALLBACK_ROUTE = route.params?.callbackRoute;
  const IS_NEED_CALLBACK = route.params?.needCallback;

  function isImageUrl(str) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    return urlPattern.test(str);
  }

  function loadImage() {
    const isUrl = isImageUrl(file);
    return isUrl ? file : `data:image/png;base64,${file}`;
  }

  function loadPDF() {
    const isUrl = isValidUrl(file);
    return isUrl ? file : `data:application/pdf;base64,${file}`;
  }

  function onSave() {
    navigation.navigate(CALLBACK_ROUTE, {
      ...EXISTING_PARAMS,
      captionedFile: {
        base64: file,
        type: type,
        caption: caption,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Header
        title={' '}
        right={
          IS_NEED_CALLBACK ? (
            <TouchableOpacity activeOpacity={0.6} onPress={onSave}>
              <Text style={{color: Colors.COLOR_PRIMARY}}>Simpan</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <View style={styles.mainContainer}>
        {type == 'application/pdf' ? (
          <>
            <Pdf
              source={{
                uri: loadPDF(),
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
          <View>
            <ImageZoom uri={loadImage()} style={styles.imageViewer} />
            {IS_NEED_CALLBACK ? (
              <View style={styles.inputContainer}>
                <TextInput
                  value={caption}
                  onChangeText={text => setCaption(text)}
                  maxLength={124}
                  placeholder="Tambahkan keterangan"
                />
              </View>
            ) : null}
            {SELECTED_CAPTION ? (
              <View style={styles.inputContainer}>
                <TextInput value={SELECTED_CAPTION} disabled />
              </View>
            ) : null}
          </View>
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

  inputContainer: {
    padding: Size.SIZE_10,
    backgroundColor: Colors.COLOR_WHITE,
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
