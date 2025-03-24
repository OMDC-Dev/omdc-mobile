import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';
import {fetchApi} from '../../api/api';
import {GET_ADMIN_PB} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {cLog} from '../../utils/utils';
import Row from '../Row';
import {Button, Text} from 'react-native-paper';

const ApprovalPBDropdown = ({
  loading,
  disabled,
  placeholder,
  setValue,
  value,
}) => {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    getList();
  }, []);

  async function getList() {
    const {state, data, error} = await fetchApi({
      url: GET_ADMIN_PB + '?mobile=true',
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      const doAdmin = data?.rows?.map(item => {
        return {label: item.nm_user, value: item?.iduser};
      });
      setItems(doAdmin);
    } else {
      setItems([]);
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
        searchable={true}
        disabled={disabled}
        searchPlaceholder="Cari..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder={placeholder || 'Pilih approval'}
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

export default ApprovalPBDropdown;

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
