import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Row from './Row';
import {Icon, IconButton} from 'react-native-paper';
import {Colors, Size} from '../styles';
import Gap from './Gap';

const FilePlaceholder = ({
  file,
  fileInfo,
  onSelectPress,
  onClosePress,
  navigation,
}) => {
  return (
    <View style={file ? styles.fileContainer : undefined}>
      {file ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('Preview', {
              file: file,
              type: fileInfo?.type,
            })
          }>
          <Row>
            <Row style={styles.fileLeft}>
              <Icon
                source={'file-document-outline'}
                size={40}
                color={Colors.COLOR_DARK_GRAY}
              />
              <Gap w={8} />
              <Text
                style={{marginRight: Size.SIZE_24}}
                numberOfLines={1}
                variant={'labelLarge'}>
                {'Gambar'}
              </Text>
            </Row>
            <IconButton
              icon={'close'}
              size={24}
              iconColor={Colors.COLOR_DARK_GRAY}
              onPress={onClosePress}
            />
          </Row>
        </TouchableOpacity>
      ) : (
        <IconButton
          icon={'plus-box-outline'}
          size={40}
          iconColor={Colors.COLOR_DARK_GRAY}
          onPress={onSelectPress}
        />
      )}
    </View>
  );
};

export default FilePlaceholder;

const styles = StyleSheet.create({
  fileContainer: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.COLOR_DARK_GRAY,
  },

  fileLeft: {
    flex: 1,
    padding: Size.SIZE_8,
  },
});
