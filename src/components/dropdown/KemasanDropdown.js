import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';

const KemasanDropdown = ({onChange}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <View
      style={{
        elevation: open ? 99 : 1,
        zIndex: open ? 99 : 1,
      }}>
      <DropDownPicker
        style={{
          width: Scaler.scaleSize(130),
        }}
        listMode={'MODAL'}
        placeholder="Pilih"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={[
          {label: 'PCS', value: 'pcs'},
          {label: 'PCX', value: 'pcx'},
        ]}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

export default KemasanDropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    color: Colors.COLOR_DARK_GRAY,
    fontFamily: 'Poppins-Regular',
    fontSize: Scaler.scaleFont(14),
  },
});
