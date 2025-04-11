import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors, Scaler} from '../../../styles';
import {fetchApi} from '../../../api/api';
import {WORKPLAN_CC_USER} from '../../../api/apiRoutes';
import {API_STATES} from '../../../utils/constant';

const WorkplanCCDropdown = ({onChange, value, ownerId}) => {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    getList();
  }, []);

  async function getList() {
    const {state, data, error} = await fetchApi({
      url: WORKPLAN_CC_USER + `?limit=1000&ownerId=${ownerId}`,
      method: 'POST',
      data: {
        selectedList: [],
      },
    });

    if (state == API_STATES.OK) {
      if (data) {
        const mapping = data?.map(item => {
          return {label: item.nm_user, value: item?.iduser};
        });

        setList(mapping);
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
        multipleText={`${value?.length} user telah dipilih`}
        multiple={true}
        searchable={true}
        searchPlaceholder="Cari user..."
        searchTextInputStyle={styles.searchInput}
        listMode={Platform.OS == 'android' ? 'MODAL' : 'SCROLLVIEW'}
        placeholder="Pilih User"
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

export default WorkplanCCDropdown;

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
