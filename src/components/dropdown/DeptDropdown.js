import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler, Size} from '../../styles';
import {fetchApi} from '../../api/api';
import {DEPT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const DeptDropdown = ({onChange, loading, disabled, defaultValue}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [deptList, setDeptList] = React.useState([]);

  React.useEffect(() => {
    onChange(value);
  }, [value]);

  React.useEffect(() => {
    getDept();
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, []);

  async function getDept() {
    const {state, data, error} = await fetchApi({
      url: DEPT,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      if (data?.rows) {
        const mapping = data?.rows.map(item => {
          return {
            label: item?.label,
            value: item?.label,
          };
        });

        setDeptList(mapping);
      }
    } else {
      setDeptList([]);
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
        searchPlaceholder="Cari departemen..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih departemen"
        placeholderStyle={styles.placeholderStyle}
        open={open}
        value={value}
        items={deptList}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

export default DeptDropdown;

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
