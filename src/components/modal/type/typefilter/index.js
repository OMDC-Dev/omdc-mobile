import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Checkbox, IconButton, Text} from 'react-native-paper';
import {Colors, Size} from '../../../../styles';
import Gap from '../../../Gap';
import Row from '../../../Row';

const TypeFilterModal = ({
  cb,
  active,
  statusActive,
  statusCb,
  onClose,
  tab,
}) => {
  const [checked, setChecked] = React.useState(active || 'all');
  const [statusChecked, setStatusChecked] = React.useState(
    statusActive || 'all',
  );

  const handlePress = value => {
    setChecked(value);
  };

  const handlePressStatus = value => {
    setStatusChecked(value);
  };

  function handleOnSave() {
    if (cb) {
      cb(checked);
    }

    if (statusCb) {
      statusCb(statusChecked);
    }

    onClose(false);
  }

  return (
    <View style={styles.container}>
      <Row justify={'space-between'}>
        <Text style={styles.subtitle} variant={'titleMedium'}></Text>
        <IconButton
          size={24}
          icon={'close'}
          onPress={() => (onClose ? onClose(false) : null)}
        />
      </Row>

      <Gap h={14} />
      <Text style={styles.subtitle} variant={'titleSmall'}>
        Tipe Pembayaran
      </Text>
      <Gap h={8} />
      <TouchableOpacity activeOpacity={0.8} onPress={() => handlePress('all')}>
        <Row justify={'space-between'}>
          <Text>Semua</Text>
          <Checkbox status={checked === 'all' ? 'checked' : 'unchecked'} />
        </Row>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress('transfer')}>
        <Row justify={'space-between'}>
          <Text>Transfer</Text>
          <Checkbox status={checked === 'transfer' ? 'checked' : 'unchecked'} />
        </Row>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} onPress={() => handlePress('cash')}>
        <Row justify={'space-between'}>
          <Text>Cash</Text>
          <Checkbox status={checked === 'cash' ? 'checked' : 'unchecked'} />
        </Row>
      </TouchableOpacity>

      {tab != 'WAITING' ? (
        <>
          <Gap h={14} />
          <Text style={styles.subtitle} variant={'titleSmall'}>
            Status Pengajuan
          </Text>
          <Gap h={8} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePressStatus('all')}>
            <Row justify={'space-between'}>
              <Text>Semua</Text>
              <Checkbox
                status={statusChecked === 'all' ? 'checked' : 'unchecked'}
              />
            </Row>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePressStatus('approved')}>
            <Row justify={'space-between'}>
              <Text>Disetujui</Text>
              <Checkbox
                status={statusChecked === 'approved' ? 'checked' : 'unchecked'}
              />
            </Row>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePressStatus('rejected')}>
            <Row justify={'space-between'}>
              <Text>Ditolak</Text>
              <Checkbox
                status={statusChecked === 'rejected' ? 'checked' : 'unchecked'}
              />
            </Row>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handlePressStatus('done')}>
            <Row justify={'space-between'}>
              <Text>Selesai</Text>
              <Checkbox
                status={statusChecked === 'done' ? 'checked' : 'unchecked'}
              />
            </Row>
          </TouchableOpacity>
        </>
      ) : null}

      <Gap h={24} />
      <Button mode={'contained'} onPress={() => handleOnSave()}>
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
