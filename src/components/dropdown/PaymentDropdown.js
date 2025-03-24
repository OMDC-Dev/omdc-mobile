import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';

const TYPE_LIST = require('../../../assets/files/payment.json');

const PaymentDropdown = ({onChange, value}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <View
      style={{
        elevation: open ? 99 : 1,
        zIndex: open ? 99 : 1,
      }}>
      <DropDownPicker
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih kategori"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={TYPE_LIST}
        setOpen={setOpen}
        setValue={onChange}
      />
    </View>
  );
};

export default PaymentDropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    color: Colors.COLOR_DARK_GRAY,
    fontFamily: 'Poppins-Regular',
    fontSize: Scaler.scaleFont(14),
  },
});
