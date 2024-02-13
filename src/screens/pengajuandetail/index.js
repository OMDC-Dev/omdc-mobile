import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Icon,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {Colors, Scaler, Size} from '../../styles';
import {Dropdown, Gap, Header, InputLabel, Row} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../../context';
import {fetchApi} from '../../api/api';
import {
  FINANCE_ACCEPTANCE,
  REIMBURSEMENT_ACCEPTANCE,
  REIMBURSEMENT_DETAIL,
  SUPERUSER,
} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {formatRupiah} from '../../utils/rupiahFormatter';
import ModalView from '../../components/modal';
import {getDataById} from '../../utils/utils';

const PengajuanDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {data} = route?.params;
  const {user} = React.useContext(AuthContext);

  // state
  const [adminList, setAdminList] = React.useState([]);
  const [admin, setAdmin] = React.useState();
  const [nominal, setNominal] = React.useState(removeRps(data?.nominal));
  const [nomEdit, setNomEdit] = React.useState(false);
  const [accMode, setAccMode] = React.useState('IDLE'); // IDLE || ACC || REJ
  const [note, setNote] = React.useState();
  const [realisasi, setRealisasi] = React.useState(data?.realisasi);

  // states
  const [isLoading, setIsLoading] = React.useState(false);
  const [snak, setSnak] = React.useState(false);
  const [snakMsg, setSnakMsg] = React.useState();
  const [statusLoading, setStatusLoading] = React.useState(true);

  const BANK_DATA = data?.bank_detail;
  const FILE_INFO = data?.file_info;
  const ITEMS = data?.item;
  const ADMINS = data?.accepted_by;
  const USER = data?.requester;

  // acceptance
  const [adminStatus, setAdminStatus] = React.useState(ADMINS);
  const [requestStatus, setRequestStatus] = React.useState(data?.status);
  const [financeStatus, setFinanceStatus] = React.useState(
    data?.status_finance,
  );
  const [financeData, setFinanceData] = React.useState(data?.finance_by);

  // dialog
  const [financeDialog, setFinanceDialog] = React.useState(false);

  const ACCEPTANCE_STATUS_BY_ID = getDataById(
    adminStatus,
    user?.iduser,
    'iduser',
    'status',
  );

  const typeName = data?.jenis_reimbursement;
  const IS_PUSHED = route?.params?.pushed;

  // ==== Get Data

  React.useEffect(() => {
    getSuperUser();
  }, []);

  React.useEffect(() => {
    getStatus();
  }, [isLoading]);

  // get admin
  async function getSuperUser() {
    try {
      const {state, data, error} = await fetchApi({
        url: SUPERUSER,
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        const doAdmin = data.map(item => {
          return {label: item.nm_user, value: item?.iduser};
        });
        setAdminList(doAdmin);
      } else {
        setAdminList([]);
      }
    } catch (error) {
      setAdminList([]);
    }
  }

  // get status
  async function getStatus() {
    setStatusLoading(true);
    const R_ID = data?.id;
    const EX_ADMIN_STATUS = data?.accepted_by;
    const EX_REQUEST_STATUS = data?.status;
    const EX_FINANCE = data?.status_finance;
    const EX_FINANCE_DATA = data?.finance_by;
    const EX_REALISASI = data?.realisasi;
    try {
      const {state, data, error} = await fetchApi({
        url: REIMBURSEMENT_ACCEPTANCE(R_ID),
        method: 'GET',
      });

      console.log(data);

      if (state == API_STATES.OK) {
        setStatusLoading(false);
        setRequestStatus(data?.status);
        setAdminStatus(data?.accepted_by);
        setFinanceStatus(data?.status_finance);
        setFinanceData(data?.finance_by);
        setRealisasi(data?.realisasi);
      } else {
        setStatusLoading(false);
        setAdminStatus(EX_ADMIN_STATUS);
        setRequestStatus(EX_REQUEST_STATUS);
        setFinanceStatus(EX_FINANCE);
        setFinanceData(EX_FINANCE_DATA);
        setRealisasi(EX_REALISASI);
      }
    } catch (error) {
      setStatusLoading(false);
      setAdminStatus(EX_ADMIN_STATUS);
      setRequestStatus(EX_REQUEST_STATUS);
      setFinanceStatus(EX_FINANCE);
      setFinanceData(EX_FINANCE_DATA);
      setRealisasi(EX_REALISASI);
    }
  }

  // set status
  async function acceptance(status) {
    setIsLoading(true);
    const R_ID = data?.id;
    const body = {
      fowarder_id: admin,
      status: admin ? 'FOWARDED' : status,
      nominal: formatRupiah(nominal),
      note: note || '',
    };

    try {
      const {state, data, error} = await fetchApi({
        url: REIMBURSEMENT_ACCEPTANCE(R_ID),
        method: 'POST',
        data: body,
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        const msg = data?.message;
        setSnakMsg(msg);
      } else {
        setIsLoading(false);
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      setSnakMsg(error);
    }
  }

  // set status finance
  async function acceptance_finance() {
    setIsLoading(true);
    const R_ID = data?.id;
    const body = {
      nominal: data?.nominal,
    };

    try {
      const {state, data, error} = await fetchApi({
        url: FINANCE_ACCEPTANCE(R_ID),
        method: 'POST',
        data: body,
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        setSnakMsg('Status berhasil diupdate!');
      } else {
        setIsLoading(false);
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      setSnakMsg(error);
    }
  }

  // ========

  const DATA_REIMBURSEMENT = [
    {
      title: 'No. Doc',
      value: data?.no_doc,
    },
    {
      title: 'Jenis Reimbursement',
      value: data?.jenis_reimbursement,
    },
    {
      title: 'Nama Vendor / Client',
      value: data?.name,
    },
    {
      title: 'Tanggal',
      value: data?.tanggal_reimbursement,
    },
    {
      title: 'Cabang',
      value: data?.kode_cabang,
    },
    {
      title: 'Deskripsi',
      value: data?.description,
    },
    {
      title: 'Lampiran',
      value: '',
    },
  ];

  const DATA_USER = [
    {
      title: 'Nama User',
      value: USER?.nm_user,
    },
    {
      title: 'Departemen',
      value: USER?.departemen,
    },
    {
      title: 'Nomor WA',
      value: USER?.nomorwa,
    },
  ];

  // set status
  const STATUS_TEXT = admin => {
    const status = admin ? admin?.status : requestStatus;
    switch (status) {
      case 'WAITING':
        return {title: 'Menunggu Disetujui', style: styles.textStatusWaiting};
        break;
      case 'APPROVED':
        return {title: 'Disetujui', style: styles.textStatusApproved};
        break;
      case 'REJECTED':
        return {title: 'Ditolak', style: styles.textStatusRejected};
        break;
      default:
        return {title: 'Menunggu Disetujui', style: styles.textStatusWaiting};
        break;
    }
  };

  // ========= func

  function removeRps() {
    if (!data?.nominal) return;

    const backFormatted = data?.nominal
      .replace(/\./g, '')
      .replace('Rp ', '')
      .trim();
    return backFormatted;
  }

  function onInputFocus() {
    if (!nominal) return;

    const backFormatted = nominal.replace(/\./g, '');
    setNominal(backFormatted);
  }

  function onInputBlur() {
    if (!nominal) return;

    const formatted = formatRupiah(nominal);
    setNominal(formatted);
  }

  function onConfirmPressed() {
    setFinanceDialog(false);
    user.type == 'ADMIN'
      ? acceptance(accMode == 'ACC' ? 'APPROVED' : 'REJECTED')
      : acceptance_finance();
  }

  function onRealisasiPressed() {
    if (data?.jenis_reimbursement == 'Cash Advance') {
      if (data.childId) {
        getChildDetail(data.childId);
      } else {
        navigation.navigate('Pengajuan', {
          type: 'CAR',
          data: {id: data?.id, no_doc: data?.no_doc},
        });
      }
    } else {
      getChildDetail(data.parentId);
    }
  }

  // get child data
  async function getChildDetail(id) {
    setIsLoading(true);
    const {state, data, error} = await fetchApi({
      url: REIMBURSEMENT_DETAIL(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      navigation.push('PengajuanDetail', {data: data, pushed: true});
    } else {
      setIsLoading(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
    }
  }

  // ========= rendering
  function renderBottomButton() {
    if (user.isAdmin) {
      if (user.type == 'FINANCE') {
        if (financeStatus == 'WAITING') {
          return (
            <View>
              <Gap h={24} />
              <Button
                loading={isLoading}
                disabled={isLoading}
                mode={'contained'}
                onPress={() => setFinanceDialog(true)}>
                Konfirmasi Sudah Ditransfer
              </Button>
            </View>
          );
        } else {
          return (
            <View>
              <Card mode={'outlined'}>
                <Card.Content style={{alignItems: 'center'}}>
                  <Text variant={'bodyMedium'}>Dana sudah ditransfer.</Text>
                </Card.Content>
              </Card>
            </View>
          );
        }
      }

      if (ACCEPTANCE_STATUS_BY_ID == 'WAITING') {
        if (accMode !== 'IDLE') {
          return (
            <View>
              <Gap h={38} />
              <InputLabel>Catatan ( opsional ) </InputLabel>
              <TextInput
                disabled={isLoading}
                style={styles.inputFull}
                mode={'outlined'}
                placeholder={'Tambahkan catatan'}
                placeholderTextColor={Colors.COLOR_DARK_GRAY}
                onChangeText={text => setNote(text)}
                value={note}
              />
              <Gap h={16} />
              <Button
                loading={isLoading}
                disabled={isLoading}
                mode={'contained'}
                onPress={() => onConfirmPressed()}>
                Konfirmasi dan {accMode == 'ACC' ? 'Setujui' : 'Tolak'}
              </Button>
              <Gap h={10} />
              <Button
                loading={isLoading}
                disabled={isLoading}
                mode={'outlined'}
                onPress={() => setAccMode('IDLE')}>
                Batalkan
              </Button>
            </View>
          );
        }

        return (
          <View>
            <Gap h={38} />
            <Button mode={'contained'} onPress={() => setAccMode('ACC')}>
              Setujui
            </Button>
            <Gap h={10} />
            <Button mode={'outlined'} onPress={() => setAccMode('REJ')}>
              Tolak
            </Button>
          </View>
        );
      } else {
        return (
          <View>
            <Card mode={'outlined'}>
              <Card.Content style={{alignItems: 'center'}}>
                <Text variant={'bodyMedium'}>
                  Permintaan telah{' '}
                  {ACCEPTANCE_STATUS_BY_ID == 'APPROVED'
                    ? 'disetujui.'
                    : 'ditolak.'}
                </Text>
              </Card.Content>
            </Card>
          </View>
        );
      }
    } else {
      if (requestStatus !== 'WAITING') {
        return (
          <View>
            <Card mode={'outlined'}>
              <Card.Content style={{alignItems: 'center'}}>
                <Text variant={'titleSmall'}>Catatan : </Text>
                <Gap h={8} />
                <Text style={{textAlign: 'center'}} variant={'bodyMedium'}>
                  {data?.note || '-'}
                </Text>
              </Card.Content>
            </Card>
            {data?.status_finance == 'DONE' &&
            data?.jenis_reimbursement == 'Cash Advance' &&
            !IS_PUSHED ? (
              <>
                <Gap h={24} />
                <Button onPress={() => onRealisasiPressed()} mode={'contained'}>
                  {data.childId ? 'Lihat' : 'Buat'} Laporan Realisasi
                </Button>
              </>
            ) : null}
            {data?.status_finance == 'DONE' &&
            data?.jenis_reimbursement == 'Cash Advance Report' &&
            !IS_PUSHED ? (
              <>
                <Gap h={24} />
                <Button onPress={() => onRealisasiPressed()} mode={'contained'}>
                  Lihat Pengajaun
                </Button>
              </>
            ) : null}
          </View>
        );
      }
    }
  }

  return (
    <View style={styles.container}>
      <Header title={'Detail Reimbursement'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}>
        <Card
          mode={'outlined'}
          onPress={() =>
            isLoading
              ? null
              : user?.isAdmin && ACCEPTANCE_STATUS_BY_ID == 'WAITING'
              ? setNomEdit(true)
              : null
          }>
          <Card.Content style={styles.cardTop}>
            <Text style={styles.textTotal} variant={'labelMedium'}>
              Total Nominal
            </Text>
            <Gap h={8} />
            {nomEdit ? (
              <>
                <TextInput
                  style={styles.input}
                  mode={'outlined'}
                  keyboardType={'phone-pad'}
                  returnKeyType={'done'}
                  placeholder={'Nominal'}
                  onBlur={onInputBlur}
                  onFocus={onInputFocus}
                  placeholderTextColor={Colors.COLOR_DARK_GRAY}
                  onChangeText={text => setNominal(text)}
                  value={nominal}
                  left={
                    <TextInput.Icon
                      icon={'cash'}
                      color={Colors.COLOR_DARK_GRAY}
                    />
                  }
                />
                <Gap h={8} />
                <Button
                  disabled={!nominal || Number(nominal) == 0}
                  mode={'text'}
                  onPress={() => setNomEdit(false)}>
                  Simpan
                </Button>
              </>
            ) : (
              <>
                <Text style={styles.textTotalValue} variant={'titleLarge'}>
                  Rp. {formatRupiah(nominal)}
                </Text>
                {user?.isAdmin && ACCEPTANCE_STATUS_BY_ID == 'WAITING' ? (
                  <>
                    <Gap h={8} />
                    <Text style={styles.textTotal} variant={'labelMedium'}>
                      ( Tekan untuk edit nominal )
                    </Text>
                  </>
                ) : (
                  <>
                    <Gap h={14} />
                    <Text
                      style={[styles.textStatus, STATUS_TEXT().style]}
                      variant={'labelMedium'}>
                      {STATUS_TEXT().title}
                    </Text>
                  </>
                )}
              </>
            )}
            {data?.childId && (
              <>
                <Gap h={14} />
                <Text style={styles.textTotal} variant={'labelSmall'}>
                  Nominal Realisasi
                </Text>
                <Gap h={8} />
                <Text style={styles.textTotalValue} variant={'titleMedium'}>
                  {formatRupiah(realisasi)}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>
        <Gap h={24} />
        <Text style={styles.subtitle} variant="titleSmall">
          Status Persetujuan
        </Text>
        <Gap h={10} />
        <View>
          {statusLoading ? (
            <Row>
              <InputLabel style={styles.rowLeft}>Loading</InputLabel>
              <ActivityIndicator />
            </Row>
          ) : (
            <>
              {adminStatus.map((item, index) => {
                return (
                  <Row key={item + index}>
                    <InputLabel style={styles.rowLeft}>
                      {item?.nm_user}
                    </InputLabel>
                    <Text
                      numberOfLines={2}
                      style={[styles.textValue, STATUS_TEXT(item).style]}
                      variant={'labelMedium'}>
                      {STATUS_TEXT(item).title}
                    </Text>
                  </Row>
                );
              })}
              {data?.status_finance !== 'IDLE' && (
                <Row>
                  <InputLabel style={styles.rowLeft}>Finance</InputLabel>
                  <Text
                    numberOfLines={3}
                    style={[styles.textValue]}
                    variant={'labelMedium'}>
                    {financeStatus == 'WAITING'
                      ? 'Sedang Ditransfer'
                      : `Sudah Ditransfer pada ${financeData?.acceptDate} oleh ${financeData?.nm_user}`}
                  </Text>
                </Row>
              )}
            </>
          )}
        </View>
        <Gap h={24} />
        <Text style={styles.subtitle} variant="titleSmall">
          Item
        </Text>
        <Gap h={10} />
        <View>
          {ITEMS.map((item, index) => {
            return (
              <View key={item + index}>
                <Gap h={2} />
                <Card style={styles.itemCard} mode={'elevated'}>
                  <Card.Content>
                    <Row>
                      <Text style={{flex: 1}} variant="labelLarge">
                        {item.name}
                      </Text>
                      <Text variant="labelLarge">Rp. {item.nominal}</Text>
                    </Row>
                  </Card.Content>
                </Card>
                <Gap h={6} />
              </View>
            );
          })}
        </View>
        {data?.isAdmin && (
          <>
            <Gap h={24} />
            <Text style={styles.subtitle} variant="titleSmall">
              Data User
            </Text>
            <Gap h={14} />
            {DATA_USER.map((item, index) => {
              return (
                <Row key={item + index}>
                  <InputLabel style={styles.rowLeft}>{item.title}</InputLabel>
                  <Text
                    numberOfLines={2}
                    style={styles.textValue}
                    variant={'labelMedium'}>
                    {item.value}
                  </Text>
                  <Gap h={6} />
                </Row>
              );
            })}
          </>
        )}

        <Gap h={24} />
        <Text style={styles.subtitle} variant="titleSmall">
          Data Reimbursement
        </Text>
        <Gap h={14} />
        {DATA_REIMBURSEMENT.map((item, index) => {
          return (
            <Row key={item + index}>
              <InputLabel style={styles.rowLeft}>{item.title}</InputLabel>
              <Text
                numberOfLines={2}
                style={styles.textValue}
                variant={'labelMedium'}>
                {item.value}
              </Text>
              <Gap h={6} />
            </Row>
          );
        })}
        <View style={styles.fileContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              isLoading
                ? null
                : navigation.navigate('Preview', {
                    file: data?.attachment,
                    type: FILE_INFO?.type,
                  })
            }>
            <Row>
              <Row style={styles.fileLeft}>
                <Icon
                  source={'file-document-outline'}
                  size={40}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={8} />
                <Text numberOfLines={1} variant={'labelLarge'}>
                  {FILE_INFO?.name}
                </Text>
              </Row>
            </Row>
          </TouchableOpacity>
        </View>
        {typeName !== 'Petty Cash Report' && (
          <>
            <Gap h={24} />
            <Text style={styles.subtitle} variant="titleSmall">
              Data Bank
            </Text>
            <Gap h={14} />
            <Row>
              <InputLabel style={styles.rowLeft}>Nama Bank</InputLabel>
              <Text style={styles.textValue} variant={'labelMedium'}>
                {BANK_DATA?.bankname}
              </Text>
              <Gap h={6} />
            </Row>
            <Row>
              <InputLabel style={styles.rowLeft}>Nomor Rekening</InputLabel>
              <Text style={styles.textValue} variant={'labelMedium'}>
                {BANK_DATA?.accountnumber}
              </Text>
              <Gap h={6} />
            </Row>
            <Row>
              <InputLabel style={styles.rowLeft}>
                Nama Pemilik Rekening
              </InputLabel>
              <Text style={styles.textValue} variant={'labelMedium'}>
                {BANK_DATA?.accountname}
              </Text>
              <Gap h={6} />
            </Row>
          </>
        )}

        <Gap h={24} />
        {ACCEPTANCE_STATUS_BY_ID == 'WAITING' && (
          <>
            <Text style={styles.subtitle} variant="titleSmall">
              Fowarder
            </Text>
            <Gap h={10} />
            <InputLabel>Teruskan persetujuan ke ( opsional )</InputLabel>
            <Dropdown.ApprovalDropdown
              data={adminList}
              disabled={isLoading}
              loading={!adminList}
              onChange={val => setAdmin(val)}
            />
          </>
        )}

        {renderBottomButton()}
      </ScrollView>
      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
      <ModalView
        type={'loading'}
        visible={isLoading}
        onModalHide={() => {
          if (snak) {
            setSnak(false);
          }
        }}
      />
      <Dialog visible={financeDialog} onDismiss={() => setFinanceDialog(false)}>
        <Dialog.Title>Konfirmasi</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Konfirmasi bahwa dana sudah di transfer?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setFinanceDialog(false)}>Batalkan</Button>
          <Button onPress={() => onConfirmPressed()}>Konfirmasi</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default PengajuanDetailScreen;

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

  rowLeft: {
    flex: 1,
  },

  cardTop: {
    alignItems: 'center',
  },

  scrollContent: {
    paddingBottom: Scaler.scaleSize(60),
  },

  fileContainer: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.COLOR_DARK_GRAY,
    padding: Size.SIZE_8,
    marginTop: Scaler.scaleSize(6),
  },

  itemCard: {
    margin: 4,
  },

  input: {
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
    width: '70%',
  },

  inputFull: {
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },

  // text

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },

  textValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },

  textTotal: {
    color: Colors.COLOR_DARK_GRAY,
  },

  textTotalValue: {
    fontWeight: 'bold',
  },

  textStatus: {
    fontWeight: 'bold',
  },

  textStatusWaiting: {
    color: Colors.COLOR_ORANGE,
  },

  textStatusApproved: {
    color: Colors.COLOR_GREEN,
  },

  textStatusRejected: {
    color: Colors.COLOR_RED,
  },
});
