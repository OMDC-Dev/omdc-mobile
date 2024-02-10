import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';

const COA_LIST = require('../../../assets/files/coa.json');

const CoaDropdown = ({onChange}) => {
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
        searchable={true}
        searchPlaceholder="Cari coa..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih COA"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={COA_LIST}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

export default CoaDropdown;

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
