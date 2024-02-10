import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Dropdown, Gap, Header, InputLabel, Row} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {
  Text,
  TextInput,
  Button as PaperButton,
  Snackbar,
} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {GET_BANK, GET_BANK_NAME, REIMBURSEMENT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {AuthContext} from '../../context';

const PengajuanBankScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const RR = route?.params?.data;

  // STATE
  const [banks, setBanks] = React.useState();
  const [selectedBank, setSelectBank] = React.useState();
  const [noBank, setNoBank] = React.useState();
  const [acc, setAcc] = React.useState();

  // proccess
  const [isLoading, setIsLoading] = React.useState(false);

  // checker
  const [checkLoading, setCheckLoading] = React.useState(false);
  const [snak, setSnak] = React.useState(false);
  const [snakMsg, setSnakMsg] = React.useState();

  // get bank list
  async function getBank() {
    const {state, data, error} = await fetchApi({url: GET_BANK, method: 'GET'});

    if (state == API_STATES.OK) {
      const doBank = data.map(item => {
        return {label: item.namaBank, value: item.kodeBank};
      });
      setBanks(doBank);
    } else {
      setBanks([]);
    }
  }

  // get bank acc name
  async function getBankName() {
    setCheckLoading(true);
    const {state, data, error} = await fetchApi({
      url: GET_BANK_NAME(selectedBank, noBank),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setCheckLoading(false);
      setAcc(data);
    } else {
      setCheckLoading(false);
      setSnakMsg(error);
      setSnak(true);
    }
  }

  React.useEffect(() => {
    getBank();
  }, []);

  // ON AJUKAN
  async function onPengajuan() {
    setIsLoading(true);

    const body = {
      type: RR.jenis,
      date: RR.tanggal,
      cabang: RR.cabang,
      description: RR.desc,
      attachment: RR.file,
      bank_detail: acc || {},
      nominal: RR.nominal,
      name: RR.name,
      item: RR.item,
      coa: RR.coa,
      file: RR.fileInfo,
      approved_by: RR.admin,
    };

    const {state, data, error} = await fetchApi({
      url: REIMBURSEMENT,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      navigation.navigate('PengajuanDone');
    } else {
      setIsLoading(false);
      setSnakMsg(error);
      setSnak(true);
    }
  }

  if (RR.jenis == 'PC') {
    return (
      <View style={styles.container}>
        <Header title={'Reimbursement'} />
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{flexGrow: 1}}>
          <Text style={styles.subtitle} variant="titleSmall">
            Konfirmasi
          </Text>
          <Gap h={14} />
          <Text variant={'labelMedium'}>
            Pastikan data yang anda masukan sebelumnya telah sesuai.
          </Text>
          <View style={styles.bottomContainer}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={() => onPengajuan()}>
              Ajukan Reimbursement
            </Button>
          </View>
        </ScrollView>
        <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
          {snakMsg || ''}
        </Snackbar>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={'Reimbursement'} />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{flexGrow: 1}}>
        <Text style={styles.subtitle} variant="titleSmall">
          Data Bank
        </Text>
        <Gap h={14} />
        <InputLabel>Bank</InputLabel>
        <Dropdown.BankDropdown
          disabled={checkLoading || isLoading}
          data={banks}
          onChange={val => setSelectBank(val)}
        />

        <Gap h={14} />
        <InputLabel>Nomor Rekening</InputLabel>
        <Row>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            editable={!checkLoading && !isLoading}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            placeholder={'Nomor Rekening'}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setNoBank(text)}
            value={noBank}
          />
          <View style={styles.checkerView}>
            <PaperButton
              disabled={!noBank}
              loading={checkLoading}
              onPress={() => getBankName()}>
              {checkLoading ? '' : 'Cek Nomor'}
            </PaperButton>
          </View>
        </Row>
        <Gap h={14} />
        <InputLabel>Nama Pemilik Rekening</InputLabel>
        <TextInput
          disabled
          editable={false}
          style={styles.inputNormal}
          mode={'outlined'}
          placeholder={'Nama Pemilik Rekening'}
          placeholderTextColor={Colors.COLOR_DARK_GRAY}
          value={acc?.accountname || ''}
        />
        <View style={styles.bottomContainer}>
          <Button
            loading={isLoading}
            disabled={!acc || isLoading}
            onPress={() => onPengajuan()}>
            Ajukan Reimbursement
          </Button>
        </View>
      </ScrollView>
      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
    </View>
  );
};

export default PengajuanBankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingTop: Scaler.scaleSize(38),
  },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  inputNormal: {
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },

  input: {
    flex: 2,
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },

  card: {
    borderRadius: 8,
    backgroundColor: Colors.COLOR_WHITE,
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Size.SIZE_10,
  },

  checkerView: {
    flex: 1,
    paddingHorizontal: Size.SIZE_10,
  },

  // text

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
