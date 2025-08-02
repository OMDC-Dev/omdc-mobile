import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Checkbox, Text} from 'react-native-paper';
import Row from './Row';
import Gap from './Gap';

const PickList = ({checked, setChecked}) => {
  return (
    <Row>
      <Row>
        <Checkbox
          status={checked == 'AKTIF' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('AKTIF')}
        />
        <Gap w={8} />
        <Text variant={'labelLarge'}>Aktif</Text>
      </Row>
      <Gap w={24} />
      <Row>
        <Checkbox
          status={checked == 'TIDAKAKTIF' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('TIDAKAKTIF')}
        />
        <Gap w={8} />
        <Text variant={'labelLarge'}>Tidak Aktif</Text>
      </Row>
    </Row>
  );
};

export default PickList;

const styles = StyleSheet.create({});
