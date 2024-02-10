import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';

const BankDropdown = ({disabled, data = [], onChange}) => {
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
        disabled={disabled}
        searchable={true}
        searchPlaceholder="Cari bank..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih bank"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={data}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

export default BankDropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    fontFamily: 'Poppins-Regular',
    color: Colors.COLOR_DARK_GRAY,
    fontSize: Scaler.scaleFont(14),
  },

  searchInput: {
    height: Scaler.scaleSize(38),
    borderWidth: 0.5,
    borderColor: Colors.COLOR_DARK_GRAY,
  },
});
