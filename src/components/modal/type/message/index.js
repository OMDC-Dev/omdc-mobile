import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, Size} from '../../../../styles';
import {Button, Text} from 'react-native-paper';
import Gap from '../../../Gap';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ModalPopUpMessage = ({message = '', onPress}) => {
  return (
    <View style={styles.container}>
      <Gap h={14} />
      <Icon name={'alert-outline'} size={32} color={Colors.COLOR_ORANGE} />
      <Gap h={14} />
      <Text variant={'labelMedium'} style={styles.textMessage}>
        {message}
      </Text>
      <Gap h={24} />
      <Button onPress={onPress}>Ok</Button>
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

export default ModalPopUpMessage;
