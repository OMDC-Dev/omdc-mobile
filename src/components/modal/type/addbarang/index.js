import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Text, TextInput} from 'react-native-paper';
import InputLabel from '../../../InputLabel';
import Row from '../../../Row';
import {Button, Dropdown, Gap} from '../../..';
import {Scaler, Size} from '../../../../styles';

const AddBarangModal = () => {
  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={'Masukan Detail'} />
        <Card.Content>
          <InputLabel>Jumlah Stok</InputLabel>
          <Row>
            <TextInput
              placeholder="Jumlah Stok"
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
            />
            <Dropdown.KemasanDropdown onChange={val => null} />
          </Row>
          <Gap h={12} />
          <InputLabel>Jumlah Permintaan</InputLabel>
          <Row>
            <TextInput
              placeholder="Jumlah Permintaan"
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
            />
            <Dropdown.KemasanDropdown onChange={val => null} />
          </Row>
          <Gap h={12} />
          <InputLabel>Keterangan</InputLabel>
          <TextInput
            placeholder="Keterangan"
            style={styles.inputNormal}
            mode={'outlined'}
          />
          <Gap h={24} />
          <Button>Tambahkan Barang</Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default AddBarangModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  input: {
    flex: 1,
    height: Scaler.scaleSize(48),
    marginRight: Size.SIZE_8,
  },

  inputNormal: {
    height: Scaler.scaleSize(48),
  },
});
