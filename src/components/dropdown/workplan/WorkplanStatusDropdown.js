import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../../styles';

const STATUS_LIST = require('../../../../assets/files/workplanstatus.json');

const WorkplanStatusDropdown = ({onChange, value}) => {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    setList(STATUS_LIST);
  }, []);

  return (
    <View
      style={{
        elevation: open ? 99 : 1,
        zIndex: open ? 99 : 1,
      }}>
      <DropDownPicker
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih status"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={list}
        setOpen={setOpen}
        setValue={onChange}
      />
    </View>
  );
};

export default WorkplanStatusDropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    color: Colors.COLOR_DARK_GRAY,
    fontFamily: 'Poppins-Regular',
    fontSize: Scaler.scaleFont(14),
  },
});
