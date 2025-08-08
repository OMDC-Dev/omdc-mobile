import * as React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import {Colors, Scaler, Size} from '../styles';

function isImageUrl(str) {
  const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
  return urlPattern.test(str);
}

function loadImage(file) {
  const isUploaded = file['id'] != null;
  return isUploaded
    ? file['image_url']
    : `data:image/png;base64,${file['base64']}`;
}

const MultiImageSelector = ({
  onSelectFile,
  onDeleteFile,
  files = [],
  onImagePress,
}) => {
  return (
    <Card style={styles.cardContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.selectorContainer}>
          <IconButton
            icon={'plus-box-outline'}
            size={40}
            iconColor={Colors.COLOR_DARK_GRAY}
            onPress={onSelectFile}
          />
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.previewScrollContainer}
          showsHorizontalScrollIndicator={false}>
          {files.map((item, index) => (
            <View key={index} style={styles.selectorContainerImage}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onImagePress?.(item)}>
                <Image
                  source={{uri: loadImage(item)}}
                  style={styles.image}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>

              <IconButton
                icon="close"
                size={10}
                onPress={() => onDeleteFile?.(index)}
                style={styles.closeButton}
                containerColor="white"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    width: Scaler.scaleSize(64),
    height: Scaler.scaleSize(64),
    borderWidth: 0.5,
    borderColor: Colors.COLOR_GRAY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Size.SIZE_8,
  },
  selectorContainerImage: {
    position: 'relative',
    width: Scaler.scaleSize(64),
    height: Scaler.scaleSize(64),
    marginHorizontal: Size.SIZE_8,
  },
  image: {
    width: Scaler.scaleSize(64),
    height: Scaler.scaleSize(64),
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: -14,
    right: -14,
    zIndex: 10,
  },

  cardContainer: {
    margin: 4,
    padding: Size.SIZE_12,
  },

  selectorContainer: {
    borderWidth: 0.5,
    borderColor: Colors.COLOR_GRAY,
    borderRadius: 12,
  },

  fileContainer: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.COLOR_DARK_GRAY,
  },

  fileLeft: {
    flex: 1,
    padding: Size.SIZE_8,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  previewScrollContainer: {
    paddingVertical: 8,
    paddingLeft: Size.SIZE_8,
  },
});

export default MultiImageSelector;
