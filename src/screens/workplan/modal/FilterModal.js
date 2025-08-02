import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {Dropdown, Gap, InputLabel, Row} from '../../../components';
import {Button, Card, IconButton, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Size} from '../../../styles';
import moment from 'moment';
import WorkplanTypeDropdown from '../../../components/dropdown/workplan/WokrplanTypeDropdown';

const FilterModal = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [type, setType] = React.useState('');
  const [cabang, setCabang] = React.useState('');
  const [kategori, setKategori] = React.useState('');

  let CURRENT_FILTER = `fCabang=${cabang}&fType=${type}&fKategori=${kategori}`;

  function onReset() {
    setType('');
    setCabang('');
    setKategori('');
  }

  const PARAMS = route.params;
  const EXT_FILTER = route?.params?.filter;

  React.useEffect(() => {
    if (EXT_FILTER) {
      const SPLIT_EXT = EXT_FILTER?.split('&');
      const F_CABANG = SPLIT_EXT[0]?.split('=')[1] ?? '';
      const F_TYPE = SPLIT_EXT[1]?.split('=')[1] ?? '';
      const F_KATEGORI = SPLIT_EXT[2]?.split('=')[1] ?? '';

      setCabang(F_CABANG);
      setType(F_TYPE);
      setKategori(F_KATEGORI);
    }
  }, [EXT_FILTER]);

  return (
    <View style={styles.container}>
      <Row justify={'space-between'}>
        <View style={styles.titleContainer}>
          <Text variant={'titleMedium'} style={styles.textProgress}>
            Filter
          </Text>
        </View>

        <IconButton icon={'close'} onPress={() => navigation.goBack()} />
      </Row>
      <View style={styles.mainContainer}>
        {/* <InputLabel>Jenis Workplan</InputLabel>
        <WorkplanTypeDropdown value={type} onChange={val => setType(val)} />

        <Gap h={6} /> */}
        <InputLabel>Cabang</InputLabel>
        <Dropdown.CabangWorkplanDropdown
          onChange={val => setCabang(val)}
          value={cabang}
        />

        <Gap h={14} />
        <InputLabel>Kategori</InputLabel>
        <Dropdown.PaymentDropdown
          value={kategori}
          onChange={val => setKategori(val)}
        />

        <Gap h={32} />
        <Button
          mode={'contained'}
          onPress={() =>
            navigation.navigate(PARAMS?.name, {
              ...PARAMS,
              filter: CURRENT_FILTER,
            })
          }>
          Terapkan Filter
        </Button>
        <Gap h={14} />
        <Button mode={'outlined'} onPress={onReset}>
          Reset Filter
        </Button>
      </View>
    </View>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: Size.SIZE_14,
  },

  titleContainer: {
    marginLeft: Size.SIZE_14,
  },

  // text
  textProgress: {
    color: Colors.COLOR_BLACK,
  },
});
