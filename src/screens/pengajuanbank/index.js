import {Platform, ScrollView, StyleSheet, View} from 'react-native';
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

  // Cash Advance Report
  const REPORT_DATA = RR?.report;

  // Payment Request Data
  const PR_BANK = RR?.suplier;
  const IS_NEED_BANK = RR?.needBank;
  const IS_PRE_BANK =
    PR_BANK?.nm_bank && PR_BANK?.no_rekbank && PR_BANK?.nm_pemilik_rek;
  const PRE_BANK_DATA = {
    bankcode: '000',
    bankname: PR_BANK?.nm_bank,
    accountnumber: PR_BANK?.no_rekbank,
    accountname: PR_BANK?.nm_pemilik_rek,
  };
  const PR_TYPE = RR?.payment_type;
  const PRE_BANK_NAME = `${PR_BANK?.kdsp} - ${PR_BANK?.nmsp}`;
  const SUPLIER_DATA =
    RR.jenis == 'PR'
      ? [
          {
            label: 'Kode Suplier',
            value: PR_BANK?.kdsp,
          },
          {
            label: 'Nama Suplier',
            value: PR_BANK?.nmsp,
          },
          {
            label: 'Alamat',
            value: `${PR_BANK?.kota}, ${PR_BANK?.provinsi}`,
          },
        ]
      : [];

  // STATE
  const [banks, setBanks] = React.useState();
  const [selectedBank, setSelectBank] = React.useState();
  const [noBank, setNoBank] = React.useState();
  const [acc, setAcc] = React.useState();
  const [mode, setMode] = React.useState('TRANSFER');

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

  console.log('PAYMENT FROM ROUTE', PR_TYPE);
  console.log('IS NEED BANK ', IS_NEED_BANK);
  console.log('MODE', mode);
  console.log('JENIS', RR.jenis);

  // ON AJUKAN
  async function onPengajuan() {
    setIsLoading(true);

    // let PT = '';

    // if (RR.jenis == 'CAR') {
    //   PT = !IS_NEED_BANK ? PR_TYPE : mode;
    // } else {
    //   PT = mode;
    // }

    // console.log('PT', PT);

    const body = {
      type: RR.jenis,
      date: RR.tanggal,
      cabang: RR.cabang,
      description: RR.desc,
      attachment: RR.file,
      bank_detail: IS_PRE_BANK ? PRE_BANK_DATA : acc || {},
      nominal: RR.nominal,
      name: RR.jenis == 'PR' ? PRE_BANK_NAME : RR.name,
      item: RR.item,
      coa: RR.coa,
      file: RR.fileInfo,
      approved_by: RR.admin,
      parentId: REPORT_DATA?.id || '',
      payment_type: mode,
      tipePembayaran: RR.tipePembayaran,
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

  // Handle petty cash report and Cash Advance Report
  if (RR.jenis == 'PC') {
    return (
      <View style={styles.container}>
        <Header title={'Request of Payment'} />
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{flexGrow: 1}}>
          <Text style={styles.subtitle} variant="titleSmall">
            Konfirmasi
          </Text>
          <Gap h={14} />
          <Text variant={'bodyMedium'}>
            Pastikan data yang anda masukan sebelumnya telah sesuai.
          </Text>
          <View style={styles.bottomContainer}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={() => onPengajuan()}>
              Ajukan Request of Payment
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
      <Header title={'Request of Payment'} />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{flexGrow: 1}}>
        <Text style={styles.subtitle} variant="titleSmall">
          Jenis Pembayaran
        </Text>
        <Row style={styles.modeContainer}>
          <PaperButton
            onPress={() => setMode('TRANSFER')}
            style={styles.modeButton}
            mode={mode == 'TRANSFER' ? 'contained' : 'outlined'}>
            Transfer
          </PaperButton>
          <PaperButton
            onPress={() => setMode('CASH')}
            style={styles.modeButton}
            mode={mode == 'CASH' ? 'contained' : 'outlined'}>
            Cash
          </PaperButton>
        </Row>
        <Gap h={14} />
        {mode == 'CASH' ? (
          <>
            <Text style={styles.subtitle} variant="titleSmall">
              Konfirmasi
            </Text>
            <Gap h={14} />
            <Text variant={'bodyMedium'}>
              Pastikan data yang anda masukan sebelumnya telah sesuai.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.subtitle} variant="titleSmall">
              Data Bank
            </Text>
            <Gap h={8} />
            <InputLabel>Bank</InputLabel>
            {IS_PRE_BANK ? (
              <Text variant={'bodyMedium'}>{PR_BANK?.nm_bank}</Text>
            ) : acc?.accountname?.length ? (
              <TextInput
                disabled
                editable={false}
                style={styles.inputNormal}
                mode={'outlined'}
                placeholder={'Bank'}
                placeholderTextColor={Colors.COLOR_DARK_GRAY}
                value={acc?.bankname || ''}
              />
            ) : (
              <Dropdown.BankDropdown
                disabled={checkLoading || isLoading || acc?.accountname?.length}
                data={banks}
                onChange={val => setSelectBank(val)}
                placeholder={acc?.accountname?.length || 'Pilih bank'}
              />
            )}

            <Gap h={8} />
            <InputLabel>Nomor Rekening</InputLabel>
            {IS_PRE_BANK ? (
              <Text variant={'bodyMedium'}>{PR_BANK?.no_rekbank}</Text>
            ) : (
              <Row>
                <TextInput
                  style={styles.input}
                  mode={'outlined'}
                  disabled={acc?.accountname?.length}
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
                    disabled={
                      !noBank ||
                      acc?.accountname?.length ||
                      checkLoading ||
                      !selectedBank
                    }
                    loading={checkLoading}
                    onPress={() => getBankName()}>
                    {checkLoading ? '' : 'Cek Nomor'}
                  </PaperButton>
                </View>
              </Row>
            )}
            <Gap h={8} />
            <InputLabel>Nama Pemilik Rekening</InputLabel>
            {IS_PRE_BANK ? (
              <Text variant={'bodyMedium'}>{PR_BANK?.nm_pemilik_rek}</Text>
            ) : (
              <TextInput
                disabled
                editable={false}
                style={styles.inputNormal}
                mode={'outlined'}
                placeholder={'Nama Pemilik Rekening'}
                placeholderTextColor={Colors.COLOR_DARK_GRAY}
                value={acc?.accountname || ''}
              />
            )}
            {!IS_PRE_BANK && acc?.accountname?.length ? (
              <>
                <Gap h={24} />
                <PaperButton
                  mode={'outlined'}
                  onPress={() => {
                    setAcc();
                    setNoBank('');
                  }}>
                  Ganti Data Bank
                </PaperButton>
              </>
            ) : null}
          </>
        )}
        {/* Suplier Section */}
        {SUPLIER_DATA?.length ? (
          <>
            <Gap h={28} />
            <Text style={styles.subtitle} variant="titleSmall">
              Data Suplier
            </Text>
            {SUPLIER_DATA.map((item, index) => {
              return (
                <View key={item + index}>
                  <Gap h={8} />
                  <InputLabel>{item.label}</InputLabel>
                  <Text variant={'bodyMedium'}>{item.value}</Text>
                </View>
              );
            })}
          </>
        ) : null}
        <View style={styles.bottomContainer}>
          <Button
            loading={isLoading}
            disabled={IS_PRE_BANK || mode == 'CASH' ? false : !acc || isLoading}
            onPress={() => onPengajuan()}>
            Ajukan Request of Payment
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
    paddingTop: Platform.OS == 'ios' ? Scaler.scaleSize(38) : 0,
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

  modeButton: {
    flex: 1,
    borderRadius: 8,
    marginHorizontal: 4,
  },

  modeContainer: {
    marginTop: Size.SIZE_8,
    paddingVertical: Size.SIZE_8,
    marginBottom: Size.SIZE_8,
  },

  // text

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
