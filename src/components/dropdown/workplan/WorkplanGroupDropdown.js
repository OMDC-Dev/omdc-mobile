import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../../styles';

const LIST = require('../../../../assets/files/workplangroup.json');

const WorkplanGroupDropdown = ({onChange, value}) => {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(null);
  const [list, setList] = React.useState([]);

  //const hasPaymentRequest = cekAkses('#6', user?.kodeAkses);

  React.useEffect(() => {
    // console.log('HAS PR', hasPaymentRequest);
    // if (!hasPaymentRequest) {
    //   const newList = TYPE_LIST.filter(item => {
    //     return item.value !== 'PR';
    //   });

    //   setList(newList);
    // } else {
    //   setList(TYPE_LIST);
    // }
    setList(LIST);
  }, []);

  // React.useEffect(() => {
  //   onChange(value);
  // }, [value]);

  return (
    <View
      style={{
        elevation: open ? 99 : 1,
        zIndex: open ? 99 : 1,
      }}>
      <DropDownPicker
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih grup work in progress"
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

export default WorkplanGroupDropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    color: Colors.COLOR_DARK_GRAY,
    fontFamily: 'Poppins-Regular',
    fontSize: Scaler.scaleFont(14),
  },
});
