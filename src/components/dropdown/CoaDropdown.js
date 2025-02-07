import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';
import {fetchApi} from '../../api/api';
import {GET_COA} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const COA_LIST = require('../../../assets/files/coa.json');

const CoaDropdown = ({onChange, placeholder, disabled, value}) => {
  const [open, setOpen] = React.useState(false);
  const [coa, setCoa] = React.useState([]);

  React.useEffect(() => {
    getCoaList();
  }, []);

  async function getCoaList() {
    console.log('COA LIST');
    const {state, data, error} = await fetchApi({
      url: GET_COA() + '&limit=1000',
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      if (data?.rows) {
        const mapping = data?.rows.map(item => {
          return {
            value: `${item?.id_coa} - ${item?.accountname}`,
            label: item?.accountname,
          };
        });

        setCoa(mapping);
      }
    } else {
      setCoa([]);
    }
  }

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
        placeholder={placeholder || 'Pilih COA / Grup Biaya'}
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={coa}
        setOpen={disabled ? undefined : setOpen}
        setValue={onChange}
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
