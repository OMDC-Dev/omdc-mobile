import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  Button,
  Container,
  Dropdown,
  Gap,
  Header,
  InputLabel,
  Row,
} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {Text, TextInput} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {API_STATES} from '../../utils/constant';
import {
  GET_CABANG,
  GET_CABANG_BY_INDUK,
  GET_CABANG_DETAIL,
} from '../../api/apiRoutes';
import ModalView from '../../components/modal';
import {useNavigation} from '@react-navigation/native';

async function getCabang(url, type = 'induk', setResult) {
  try {
    const {state, data, error} = await fetchApi({
      url: url,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      const doCabang = data.map(item => {
        return type == 'induk'
          ? {label: item.nm_induk, value: item?.kd_induk}
          : {label: item.nm_cabang, value: item?.kd_cabang};
      });
      setResult(doCabang);
    } else {
      setResult([]);
    }
  } catch (error) {
    setResult([]);
  }
}

const BarangRequestScreen = () => {
  const navigation = useNavigation();
  // cabang list
  const [cabangInduk, setCabangInduk] = React.useState();
  const [cabangAnak, setCabangAnak] = React.useState();

  // cabange selected
  const [cabangIndukSelected, setCabangIndukSelected] = React.useState();
  const [cabangAnakSelected, setCabangAnakSelected] = React.useState();
  const [cabangDetail, setCabangDetail] = React.useState();

  // state
  const [isLoading, setIsLoading] = React.useState(false);

  // get init induk
  React.useEffect(() => {
    getCabangInduk();
  }, []);

  // get cabang induk
  async function getCabangInduk() {
    await getCabang(GET_CABANG, 'induk', setCabangInduk);
  }

  // get cabang anak
  async function getCabangAnak() {
    await getCabang(
      GET_CABANG_BY_INDUK(cabangIndukSelected),
      'anak',
      setCabangAnak,
    );
  }

  // get cabang detail
  async function getCabangDetail() {
    setIsLoading(true);
    try {
      const {state, data, error} = await fetchApi({
        url: GET_CABANG_DETAIL(cabangAnakSelected),
        method: 'get',
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        setCabangDetail(data);
        console.log(data);
      } else {
        setIsLoading(false);
        setCabangDetail('ERROR');
      }
    } catch (error) {
      setIsLoading(false);
      setCabangDetail('ERROR');
    }
  }

  // get anak cabang on selected induk
  React.useEffect(() => {
    getCabangAnak();
  }, [cabangIndukSelected]);

  // get anak detail on selected
  React.useEffect(() => {
    getCabangDetail();
  }, [cabangAnakSelected]);

  return (
    <Container>
      <Header title={'Buat Permintaan Barang'} />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subtitle} variant="titleSmall">
          Data Permintaan Barang
        </Text>
        <Gap h={8} />
        <InputLabel>Cabang</InputLabel>
        <Dropdown.CabangDropdown
          data={cabangInduk}
          loading={!cabangInduk}
          onChange={val => setCabangIndukSelected(val)}
        />
        <Gap h={8} />
        <InputLabel>Kirim ke</InputLabel>
        <Dropdown.CabangDropdown
          data={cabangAnak}
          loading={!cabangAnak}
          onChange={val => setCabangAnakSelected(val)}
        />
        {cabangDetail?.alamat_cabang && (
          <>
            <Gap h={8} />
            <InputLabel>Kelurahan</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              placeholder={'Deskripsi'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={cabangDetail?.kelurahan}
              editable={false}
            />
            <Gap h={8} />
            <InputLabel>Kecamatan</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              placeholder={'Deskripsi'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={cabangDetail?.kecamatan}
              editable={false}
            />
            <Gap h={8} />
            <InputLabel>Kota / Kabupaten</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              placeholder={'Deskripsi'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={cabangDetail?.kota}
              editable={false}
            />
            <Gap h={8} />
            <InputLabel>Provinsi</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              placeholder={'Deskripsi'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={cabangDetail?.provinsi}
              editable={false}
            />
            <Gap h={8} />
            <InputLabel>Kode Pos</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              placeholder={'Deskripsi'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={String(cabangDetail?.kd_pos || '')}
              editable={false}
            />
            <Gap h={8} />
            <InputLabel>Alamat Pengiriman</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              multiline
              placeholder={'Deskripsi'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={cabangDetail?.alamat_cabang}
              editable={false}
            />
            <Gap h={32} />
            <Button
              onPress={() =>
                navigation.navigate('BarangList', {
                  cabang: {
                    indukCabang: cabangIndukSelected,
                    anakCabang: cabangAnakSelected,
                  },
                })
              }>
              Lanjut
            </Button>
          </>
        )}
      </ScrollView>
      <ModalView type={'loading'} visible={isLoading} />
    </Container>
  );
};

export default BarangRequestScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  scrollContainer: {
    paddingBottom: Scaler.scaleSize(60),
  },

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },

  input: {},

  inputRow: {
    flex: 1,
  },
});
