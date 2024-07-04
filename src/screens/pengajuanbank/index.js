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
import {cekAkses, getLabelByValue} from '../../utils/utils';

const PengajuanBankScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const RR = route?.params?.data;
  // user session
  const {user} = React.useContext(AuthContext);
  const hasPaymentRequest = cekAkses('#6', user?.kodeAkses);

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
  const SUPLIER_NAME = PR_BANK?.kdsp
    ? `${PR_BANK?.kdsp} - ${PR_BANK?.nmsp}`
    : RR.name;
  const PRE_BANK_NAME =
    RR.jenis == 'PR' && hasPaymentRequest ? SUPLIER_NAME : RR.name;

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

  const getIsDisabled = () => {
    if (isLoading) {
      return true;
    }

    if (IS_PRE_BANK || mode == 'CASH') {
      return false;
    }

    if (mode == 'TRANSFER') {
      return !acc;
    }

    if (mode == 'VA') {
      return !selectedBank && !noBank;
    }
  };

  React.useEffect(() => {
    setNoBank('');
    setSelectBank();
    setAcc();
  }, [mode]);

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

  console.log('ACC', acc);

  function renderDetailContent() {
    if (mode == 'CASH') {
      return (
        <>
          <Text style={styles.subtitle} variant="titleSmall">
            Konfirmasi
          </Text>
          <Gap h={14} />
          <Text variant={'bodyMedium'}>
            Pastikan data yang anda masukan sebelumnya telah sesuai.
          </Text>
        </>
      );
    }

    if (mode == 'TRANSFER') {
      return (
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
              value={selectedBank}
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
                disabled={isLoading}
                mode={'outlined'}
                onPress={() => {
                  setAcc();
                  setNoBank('');
                  setSelectBank('');
                }}>
                Ganti Data Bank
              </PaperButton>
            </>
          ) : null}
        </>
      );
    }

    if (mode == 'VA') {
      return (
        <>
          <Text style={styles.subtitle} variant="titleSmall">
            Data Bank
          </Text>
          <Gap h={8} />
          <InputLabel>Bank</InputLabel>
          <Dropdown.BankDropdown
            disabled={checkLoading || isLoading || acc?.accountname?.length}
            data={banks}
            value={selectedBank}
            onChange={val => setSelectBank(val)}
            placeholder={acc?.accountname?.length || 'Pilih bank'}
          />

          <Gap h={8} />
          <InputLabel>Nomor VA</InputLabel>
          <TextInput
            style={styles.inputVA}
            mode={'outlined'}
            disabled={acc?.accountname?.length}
            editable={!checkLoading && !isLoading}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            placeholder={'Nomor VA'}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setNoBank(text)}
            value={noBank}
          />
        </>
      );
    }
  }

  console.log('pre bank', PRE_BANK_NAME);

  // ON AJUKAN
  async function onPengajuan() {
    setIsLoading(true);
    let bankData;
    let jenisPembayaran;

    if (IS_PRE_BANK) {
      bankData = PRE_BANK_DATA;
    } else {
      if (mode == 'TRANSFER') {
        bankData = acc;
      } else if (mode == 'VA') {
        bankData = {
          bankcode: selectedBank,
          bankname: getLabelByValue(selectedBank),
          accountnumber: noBank,
          accountname: 'Virtual Account',
        };
      } else {
        bankData = {};
      }
    }

    if (IS_NEED_BANK) {
      jenisPembayaran = mode == 'CASH' ? 'CASH' : 'TRANSFER';
    } else {
      jenisPembayaran = PR_TYPE;
    }

    const body = {
      type: RR.jenis,
      date: RR.tanggal,
      cabang: RR.cabang,
      description: RR.desc,
      attachment: RR.file,
      bank_detail: bankData,
      nominal: RR.nominal,
      name: RR.jenis == 'PR' ? PRE_BANK_NAME : RR.name,
      item: RR.item,
      coa: RR.coa,
      file: RR.fileInfo,
      approved_by: RR.admin,
      parentId: REPORT_DATA?.id || '',
      payment_type: jenisPembayaran,
      tipePembayaran: RR.tipePembayaran,
      uploadedFile: RR.useExtFile ? RR.uploadedFile : null,
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
  if (RR.jenis == 'PC' || !IS_NEED_BANK) {
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
            disabled={isLoading}
            onPress={() => setMode('TRANSFER')}
            style={styles.modeButton}
            mode={mode == 'TRANSFER' ? 'contained' : 'outlined'}>
            Transfer
          </PaperButton>
          {RR.jenis == 'PR' ? (
            <PaperButton
              disabled={isLoading}
              onPress={() => setMode('VA')}
              style={styles.modeButton}
              mode={mode == 'VA' ? 'contained' : 'outlined'}>
              VA
            </PaperButton>
          ) : null}
          <PaperButton
            disabled={isLoading}
            onPress={() => setMode('CASH')}
            style={styles.modeButton}
            mode={mode == 'CASH' ? 'contained' : 'outlined'}>
            Cash
          </PaperButton>
        </Row>
        <Gap h={14} />
        {renderDetailContent()}
        {/* Suplier Section */}
        {/* {SUPLIER_DATA?.length ? (
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
        ) : null} */}
        <View style={styles.bottomContainer}>
          <Button
            loading={isLoading}
            disabled={getIsDisabled()}
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

  inputVA: {
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
