import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler} from '../../styles';
import {fetchApi} from '../../api/api';
import {GET_GROUP_BARANG, GET_KEMASAN} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const KemasanBarangDropdown = ({loading, disabled, value, setValue}) => {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    getList();
  }, []);

  async function getList() {
    const {state, data, error} = await fetchApi({
      url: GET_KEMASAN,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      if (data?.rows) {
        setList(data?.rows);
      } else {
        setList([]);
      }
    } else {
      setList([]);
    }
  }

  return (
    <View
      style={{
        elevation: open ? 99 : 1,
        zIndex: open ? 99 : 1,
      }}>
      <DropDownPicker
        loading={loading}
        disabled={disabled}
        searchable={true}
        searchPlaceholder="Cari..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih Kemasan"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={list}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

export default KemasanBarangDropdown;

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
