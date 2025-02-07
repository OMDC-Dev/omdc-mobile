import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  Container,
  Dropdown,
  Gap,
  Header,
  InputLabel,
  Row,
} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {Button, Card, Icon, Snackbar, Text} from 'react-native-paper';
import ModalView from '../../components/modal';
import {getDateFormat, hitungSelisihHari} from '../../utils/utils';
import {GET_CABANG} from '../../api/apiRoutes';
import {fetchApi} from '../../api/api';
import {API_STATES} from '../../utils/constant';

const SuperReimbursementScreen = () => {
  const navigation = useNavigation();

  const [showCalendar, setShowCalendar] = React.useState(false);
  const [selectDateAwal, setSelectDateAwal] = React.useState();
  const [selectDateAkhir, setSelectDateAkhir] = React.useState();
  const [dateOriginal, setDateOriginal] = React.useState({
    awal: null,
    akhir: null,
  });
  const [type, setType] = React.useState();

  // DROPDOWN
  const [cabang, setCabang] = React.useState();
  const [cabangList, setCabangList] = React.useState([]);

  const [selectedBank, setSelectBank] = React.useState();
  const [coa, setCoa] = React.useState();

  function onSeeReport() {
    const diff = hitungSelisihHari(dateOriginal.awal, dateOriginal.akhir);

    if (diff < 0) {
      Alert.alert('Gagal', 'Selisih periode tidak boleh kurang dari 1 hari.');
      return;
    }

    navigation.navigate('SuperReimbursementList', {
      date: dateOriginal,
      cabang: cabang,
      bank: selectedBank,
      coa: coa,
    });
  }

  React.useEffect(() => {
    getCabang();
  }, []);

  // get cabang
  async function getCabang() {
    try {
      const {state, data, error} = await fetchApi({
        url: GET_CABANG,
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        const doCabang = data.map(item => {
          return {label: item.nm_induk, value: item?.kd_induk};
        });
        setCabangList(doCabang);
      } else {
        setCabangList([]);
      }
    } catch (error) {
      setCabangList([]);
    }
  }

  console.log('COA', coa);

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <Header hideBack={true} title={'Report Request of Payment'} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollParent}
          showsVerticalScrollIndicator={false}>
          <InputLabel>Periode Awal *</InputLabel>
          <Card
            style={styles.card}
            mode={'outlined'}
            onPress={() => {
              setType('AWAL');
              setShowCalendar(true);
            }}>
            <Card.Content>
              <Row>
                <Icon
                  source={'calendar-range'}
                  size={20}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={10} />
                <Text variant="labelLarge">
                  {selectDateAwal || 'Pilih Tanggal'}
                </Text>
              </Row>
            </Card.Content>
          </Card>

          <Gap h={14} />
          <InputLabel>Periode Akhir *</InputLabel>
          <Card
            style={styles.card}
            mode={'outlined'}
            onPress={() => {
              setType('AKHIR');
              setShowCalendar(true);
            }}>
            <Card.Content>
              <Row>
                <Icon
                  source={'calendar-range'}
                  size={20}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={10} />
                <Text variant="labelLarge">
                  {selectDateAkhir || 'Pilih Tanggal'}
                </Text>
              </Row>
            </Card.Content>
          </Card>

          <Gap h={14} />
          <InputLabel>Cabang</InputLabel>
          <Dropdown.CabangDropdown
            data={cabangList}
            loading={!cabangList}
            onChange={val => setCabang(val)}
          />

          <Gap h={14} />
          <InputLabel>Bank Finance</InputLabel>
          <Dropdown.BankDropdown
            value={selectedBank}
            onChange={val => setSelectBank(val)}
            placeholder={'Pilih bank'}
          />

          <Gap h={14} />
          <InputLabel>COA / Grup Biaya</InputLabel>
          <Dropdown.CoaDropdown onChange={val => setCoa(val)} />

          <Gap h={32} />
          <Button
            disabled={!selectDateAkhir || !selectDateAwal}
            mode={'contained'}
            onPress={() => onSeeReport()}>
            Lihat Report
          </Button>
        </ScrollView>
      </View>

      <ModalView
        type={'calendar'}
        visible={showCalendar}
        onSaveCalendar={() => setShowCalendar(false)}
        onCancelCalendar={() => setShowCalendar(false)}
        dateCallback={val =>
          val
            ? type == 'AWAL'
              ? (setSelectDateAwal(getDateFormat(val)),
                setDateOriginal({...dateOriginal, awal: val}))
              : (setSelectDateAkhir(getDateFormat(val)),
                setDateOriginal({...dateOriginal, akhir: val}))
            : null
        }
      />
    </Container>
  );
};

export default SuperReimbursementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  scrollParent: {
    paddingBottom: Scaler.scaleSize(120),
  },
});
