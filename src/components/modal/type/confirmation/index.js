import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Colors, Size} from '../../../../styles';
import Gap from '../../../Gap';
import Row from '../../../Row';

const ModalConfirmation = ({toggle, onConfirm}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle} variant={'labelLarge'}>
        Konfirmasi
      </Text>
      <Gap h={8} />
      <Text variant={'labelMedium'} style={styles.textMessage}>
        Apakah anda yakin ingin melanjutkan aksi ini?
      </Text>
      <Gap h={24} />
      <Row
        style={{
          alignSelf: 'flex-end',
        }}>
        <Button
          onPress={() => {
            onConfirm ? onConfirm() : null;
            toggle();
          }}>
          Ok
        </Button>
        <Gap w={8} />
        <Button onPress={toggle}>Batalkan</Button>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Size.SIZE_12,
    paddingHorizontal: Size.SIZE_18,
    backgroundColor: Colors.COLOR_WHITE,
    borderRadius: 8,
    maxWidth: '80%',
  },

  textTitle: {
    fontWeight: 'bold',
  },
});

export default ModalConfirmation;
