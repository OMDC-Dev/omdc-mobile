import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Checkbox, IconButton, Text} from 'react-native-paper';
import {Colors, Size} from '../../../../styles';
import Gap from '../../../Gap';
import Row from '../../../Row';

const TypeFilterModal = ({cb, onClose}) => {
  const [checked, setChecked] = React.useState('all');

  const handlePress = value => {
    setChecked(value);
  };

  return (
    <View style={styles.container}>
      <Row justify={'space-between'}>
        <Text style={styles.subtitle} variant={'titleMedium'}>
          Tipe Pembayaran
        </Text>
        <IconButton
          size={20}
          icon={'close'}
          onPress={() => (onClose ? onClose(false) : null)}
        />
      </Row>

      <Gap h={14} />
      <Row justify={'space-between'}>
        <Text>Semua</Text>
        <Checkbox
          status={checked === 'all' ? 'checked' : 'unchecked'}
          onPress={() => handlePress('all')}
        />
      </Row>
      <Row justify={'space-between'}>
        <Text>Transfer</Text>
        <Checkbox
          status={checked === 'transfer' ? 'checked' : 'unchecked'}
          onPress={() => handlePress('transfer')}
        />
      </Row>
      <Row justify={'space-between'}>
        <Text>Cash</Text>
        <Checkbox
          status={checked === 'cash' ? 'checked' : 'unchecked'}
          onPress={() => handlePress('cash')}
        />
      </Row>
      <Gap h={24} />
      <Button
        mode={'contained'}
        onPress={() => (cb ? cb(checked, onClose(false)) : onClose(false))}>
        Simpan Filter
      </Button>
    </View>
  );
};

export default TypeFilterModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Size.SIZE_14,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: Colors.COLOR_WHITE,
  },

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
