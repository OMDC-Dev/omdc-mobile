import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';

const ApprovalDropdown = ({
  data = [],
  onChange,
  loading,
  disabled,
  placeholder,
  value,
}) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);

  return (
    <View
      style={{
        elevation: open ? 99 : 1,
        zIndex: open ? 99 : 1,
      }}>
      <DropDownPicker
        loading={loading}
        searchable={true}
        disabled={disabled}
        searchPlaceholder="Cari..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder={placeholder || 'Pilih approval'}
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={data}
        setItems={setItems}
        setOpen={setOpen}
        setValue={onChange}
      />
    </View>
  );
};

export default ApprovalDropdown;

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
