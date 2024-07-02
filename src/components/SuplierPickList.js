import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Checkbox, Text} from 'react-native-paper';
import Row from './Row';
import Gap from './Gap';

const SuplierPickList = ({checked, setChecked}) => {
  return (
    <Row>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setChecked('LIST')}>
        <Row>
          <Checkbox status={checked == 'LIST' ? 'checked' : 'unchecked'} />
          <Gap w={8} />
          <Text variant={'labelLarge'}>List</Text>
        </Row>
      </TouchableOpacity>

      <Gap w={24} />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setChecked('MANUAL')}>
        <Row>
          <Checkbox status={checked == 'MANUAL' ? 'checked' : 'unchecked'} />
          <Gap w={8} />
          <Text variant={'labelLarge'}>Manual</Text>
        </Row>
      </TouchableOpacity>
    </Row>
  );
};

export default SuplierPickList;

const styles = StyleSheet.create({});
