import {
  Alert,
  FlatList,
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
  ACCEPT_REVIEW_REIMBURSEMENT,
  FINANCE_ACCEPTANCE,
  FINANCE_UPDATE_COA,
  REIMBURSEMENT_ACCEPTANCE,
  REIMBURSEMENT_DETAIL,
  SUPERUSER,
} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {formatRupiah} from '../../utils/rupiahFormatter';
import ModalView from '../../components/modal';
import {getDataById, getLabelByValue} from '../../utils/utils';
import _ from 'lodash';
import {SIZE_14} from '../../styles/size';
import moment from 'moment';

const PengajuanDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {data} = route?.params;
  const {user} = React.useContext(AuthContext);

  // IS MINE
  const IS_MINE = route?.params?.type == 'MINE';
  const IS_REPORT = route.params?.type == 'REPORT';

  // state
  const [adminList, setAdminList] = React.useState([]);
  const [admin, setAdmin] = React.useState();
  const [nominal, setNominal] = React.useState(removeRps(data?.nominal));
  const [nomEdit, setNomEdit] = React.useState(false);
  const [accMode, setAccMode] = React.useState('IDLE'); // IDLE || ACC || REJ
  const [note, setNote] = React.useState('');
  const [realisasi, setRealisasi] = React.useState(data?.realisasi);
  const [selectedBank, setSelectedBank] = React.useState();
  // Cash Advance
  const [coa, setCoa] = React.useState(data?.coa);
  const [coaLoading, setCoaLoading] = React.useState(false);
  const [coaDisabled, setCoaDisabled] = React.useState(true);

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
  const FINANCE_BANK = data?.finance_bank;

  // acceptance
  const [adminStatus, setAdminStatus] = React.useState(ADMINS);
  const [requestStatus, setRequestStatus] = React.useState(data?.status);
  const [financeStatus, setFinanceStatus] = React.useState(
    data?.status_finance,
  );
  const [financeData, setFinanceData] = React.useState(data?.finance_by);

  // reviewer
  const [reviewStatus, setReviewStatus] = React.useState(data.reviewStatus);
  const [updateAdmin, setUpdateAdmin] = React.useState(
    data?.accepted_by[0].iduser,
  );
  const [noteList, setNoteList] = React.useState([]);

  // dialog
  const [cancelDialog, setCancelDialog] = React.useState(false);

  const ACCEPTANCE_STATUS_BY_ID = getDataById(
    adminStatus,
    user?.iduser,
    'iduser',
    'status',
  );

  const typeName = data?.jenis_reimbursement;
  const IS_PUSHED = route?.params?.pushed;
  const ID = data?.id;
  const REQUESTER_ID = data?.requester_id;

  // ==== Get Data

  React.useEffect(() => {
    getSuperUser();
  }, []);

  React.useEffect(() => {
    getStatus();
  }, [isLoading]);

  React.useEffect(() => {
    if (!updateAdmin) {
      setUpdateAdmin(data?.accepted_by[0].iduser);
    }
  }, [updateAdmin]);

  // get admin
  async function getSuperUser() {
    try {
      const {state, data, error} = await fetchApi({
        url: SUPERUSER + `?limit=100&exceptId=${REQUESTER_ID}`,
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        const doAdmin = data?.rows?.map(item => {
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
        setCoa(data?.coa);
        setReviewStatus(data?.reviewStatus);
        setNoteList(data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // delete reimburse
  async function deleteReimbursement() {
    setCancelDialog(false);
    setIsLoading(true);
    const {state, data, error} = await fetchApi({
      url: REIMBURSEMENT_DETAIL(ID),
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      Alert.alert('Sukses', 'Pengajuan berhasil dibatalkan dan dihapus', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      setIsLoading(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
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
      note: note,
      coa: coa,
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
        setSnak(true);
        getStatus();
      } else {
        setIsLoading(false);
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      setSnakMsg(error);
      setSnak(true);
    }
  }

  // set status finance
  async function acceptance_finance(status) {
    setIsLoading(true);
    const R_ID = data?.id;
    const body = {
      nominal: data?.nominal,
      note: note,
      coa: coa,
      bank: selectedBank,
    };

    try {
      const {state, data, error} = await fetchApi({
        url: FINANCE_ACCEPTANCE(R_ID, status),
        method: 'POST',
        data: body,
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        setSnakMsg('Status berhasil diupdate!');
        setSnak(true);
        setCoaDisabled(true);
      } else {
        setIsLoading(false);
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      setSnakMsg(error);
      setSnak(true);
    }
  }

  // set status finance
  async function acceptance_reviewer(status) {
    setIsLoading(true);
    const R_ID = data?.id;
    const body = {
      note: note,
      coa: coa,
      adminId: updateAdmin,
      status: status,
    };

    try {
      const {state, data, error} = await fetchApi({
        url: ACCEPT_REVIEW_REIMBURSEMENT(R_ID),
        method: 'POST',
        data: body,
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        setSnakMsg('Permintaan telah berhasil disimpan dan disetujui!');
        setSnak(true);
        setCoaDisabled(true);
      } else {
        setIsLoading(false);
        throw error;
      }
    } catch (error) {
      setIsLoading(false);
      setSnakMsg(error);
      setSnak(true);
    }
  }

  // UPDATE COA
  async function updateCOA() {
    setCoaLoading(true);
    const body = {
      coa: coa,
    };
    const {state, data, error} = await fetchApi({
      url: FINANCE_UPDATE_COA(ID),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setCoaLoading(false);
      setSnakMsg('Sukses mengupdate COA / Grup Biaya');
      setSnak(true);
      setCoaDisabled(true);
    } else {
      setCoaLoading(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
    }
  }

  // ========

  const DATA_REIMBURSEMENT = [
    {
      title: 'No. Doc',
      value: data?.no_doc,
    },
    {
      title: 'Jenis Request of Payment',
      value: data?.jenis_reimbursement,
    },
    {
      title: 'Tipe Pembayaran',
      value: data?.tipePembayaran,
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
      title: 'Tanggal Dibuat',
      value: moment(data?.createdAt).format('lll'),
    },
    {
      title: 'Cabang',
      value: data?.kode_cabang,
    },
    {
      title: 'Jenis Pembayaran',
      value: data?.payment_type == 'CASH' ? 'Cash' : 'Transfer',
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
      title: 'Jabatan',
      value: USER?.level_user,
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
    if (user.type == 'ADMIN') {
      acceptance(accMode == 'ACC' ? 'APPROVED' : 'REJECTED');
    } else if (user.type == 'REVIEWER') {
      acceptance_reviewer(accMode == 'ACC' ? 'APPROVED' : 'REJECTED');
    } else {
      acceptance_finance(accMode == 'ACC' ? 'DONE' : 'REJECTED');
    }
  }

  function onRealisasiPressed() {
    if (data?.jenis_reimbursement == 'Cash Advance') {
      if (data.childId) {
        getChildDetail(data.childId);
      } else {
        navigation.navigate('Pengajuan', {
          type: 'CAR',
          data: {
            id: data?.id,
            no_doc: data?.no_doc,
            nominal: data?.nominal,
            cabang: data?.kode_cabang,
            coa: data?.coa,
            payment_type: data?.payment_type,
          },
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
      navigation.push('PengajuanDetail', {
        data: data,
        pushed: true,
        type: 'MINE',
      });
    } else {
      setIsLoading(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
    }
  }

  // ===== function to calculate saldo
  const calculateSaldo = (nominal = '', realisasi = '') => {
    if (!nominal || !realisasi) {
      return '-';
    }

    const intNominal = parseInt(nominal.replace('Rp. ', '').replace(/\./g, ''));
    const intRealisasi = parseInt(
      realisasi.replace('Rp. ', '').replace(/\./g, ''),
    );

    const saldo = intNominal - intRealisasi;

    return 'Rp. ' + formatRupiah(saldo);
  };

  //  ACC DAN REJECT STATE
  function renderAcceptRejectState() {
    if (accMode !== 'IDLE') {
      // ACC MODE TYPE DITERIMA / DITOLAK
      return (
        <View>
          <Gap h={38} />
          <>
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
          </>

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

    if (user.type == 'FINANCE') {
      return (
        <View>
          <Gap h={38} />
          <Button
            disabled={
              isLoading || (!selectedBank && data?.payment_type == 'TRANSFER')
            }
            mode={'contained'}
            onPress={() => setAccMode('ACC')}>
            {_.isEmpty(BANK_DATA)
              ? 'Konfirmasi Dana Diterima'
              : 'Konfirmasi Dana Ditransfer'}
          </Button>
          <Gap h={10} />
          <Button mode={'outlined'} onPress={() => setAccMode('REJ')}>
            Tolak Pengajuan
          </Button>
        </View>
      );
    }

    return (
      <View>
        <Gap h={38} />
        <Button mode={'contained'} onPress={() => setAccMode('ACC')}>
          Simpan dan Setujui
        </Button>
        <Gap h={10} />
        <Button mode={'outlined'} onPress={() => setAccMode('REJ')}>
          Tolak
        </Button>
      </View>
    );
  }

  // On State Finished
  function BottomNote({title = '', message = '', key}) {
    return (
      <Card mode={'outlined'}>
        <Card.Content style={{alignItems: 'center'}}>
          <Text variant={'titleSmall'}>{title}</Text>
          <Gap h={8} />
          <Text style={{textAlign: 'center'}} variant={'bodyMedium'}>
            {message}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // Cash Advance Report Pengajuan Button
  function renderCARPengajuanButton() {
    if (
      data?.parentId &&
      data?.jenis_reimbursement === 'Cash Advance Report' &&
      !IS_PUSHED
    ) {
      return (
        <>
          <Gap h={24} />
          <Button onPress={() => onRealisasiPressed()} mode={'contained'}>
            Lihat Pengajuan
          </Button>
        </>
      );
    } else {
      return null;
    }
  }

  // render CAR create or just see report
  function renderCARCreateDetailReport(type) {
    if (type == 'ADMIN') {
      if (
        data?.jenis_reimbursement === 'Cash Advance' &&
        data?.childId &&
        !IS_PUSHED
      ) {
        return (
          <>
            <Gap h={24} />
            <Button onPress={() => onRealisasiPressed()} mode={'contained'}>
              Lihat Laporan Realisasi
            </Button>
          </>
        );
      } else return null;
    } else {
      if (
        data?.status_finance == 'DONE' &&
        data?.jenis_reimbursement == 'Cash Advance' &&
        !IS_PUSHED
      ) {
        return (
          <>
            <Gap h={14} />
            <Button onPress={() => onRealisasiPressed()} mode={'contained'}>
              {data.childId ? 'Lihat' : 'Buat'} Laporan Realisasi
            </Button>
          </>
        );
      } else return null;
    }
  }

  // render cancel pengajuan button
  function renderCancelPengajuanButton() {
    if (requestStatus !== 'WAITING') return;
    if (IS_PUSHED) return;

    return (
      <>
        <Gap h={24} />
        <Button mode="outlined" onPress={() => setCancelDialog(true)}>
          Batalkan Pengajuan
        </Button>
      </>
    );
  }

  // render admin done card
  function renderAdminDoneCard() {
    let status_approved;

    if (user.type == 'ADMIN') {
      status_approved =
        ACCEPTANCE_STATUS_BY_ID == 'APPROVED' ? 'disetujui.' : 'ditolak.';
    }

    if (user.type == 'REVIEWER') {
      status_approved = reviewStatus == 'REJECTED' ? 'ditolak.' : 'disetujui.';
    }

    return (
      <Card mode={'outlined'}>
        <Card.Content style={{alignItems: 'center'}}>
          <Text variant={'bodyMedium'}>Permintaan telah {status_approved}</Text>
        </Card.Content>
      </Card>
    );
  }

  // render finance on transfer sender bank
  function renderSenderBankFinance() {
    if (data?.payment_type == 'CASH') return;

    return (
      <>
        <Gap h={14} />
        <InputLabel>Bank Pengirim</InputLabel>
        <Dropdown.BankDropdown
          disabled={isLoading}
          onChange={val => setSelectedBank(getLabelByValue(val))}
          placeholder={'Pilih bank'}
        />
      </>
    );
  }

  // ========= rendering
  function renderBottomButton() {
    if (user.isAdmin && !IS_MINE) {
      //  FINANCE SECTION
      if (user.type == 'FINANCE') {
        // FINANCE STATUS WAITING
        if (financeStatus == 'WAITING') {
          return (
            <View>
              {renderSenderBankFinance()}

              <Gap h={14} />
              {renderAcceptRejectState()}
            </View>
          );
        } else {
          // FINANCE STATUS DONE
          return (
            <View>
              <Gap h={14} />
              <Card mode={'outlined'}>
                <Card.Content style={{alignItems: 'center'}}>
                  <Text variant={'bodyMedium'}>
                    {financeStatus == 'REJECTED'
                      ? 'Pengajuan telah ditolak'
                      : _.isEmpty(BANK_DATA)
                      ? 'Selesai'
                      : 'Dana sudah ditransfer.'}
                  </Text>
                </Card.Content>
              </Card>
              {renderCARCreateDetailReport('ADMIN')}
              {renderCARPengajuanButton()}
            </View>
          );
        }
      }

      // REVIEWER SECTION
      if (user.type == 'REVIEWER') {
        if (reviewStatus == 'IDLE') {
          return renderAcceptRejectState();
        }

        return (
          <>
            <Gap h={10} />
            {renderAdminDoneCard()}
          </>
        );
      }

      // ADMIN SECTION
      if (ACCEPTANCE_STATUS_BY_ID == 'WAITING') {
        // ADMIN STATUS
        return renderAcceptRejectState();
      } else {
        // ADMIN STATUS DONE
        return (
          <View>
            <Gap h={14} />
            {renderAdminDoneCard()}
            {renderCARCreateDetailReport('ADMIN')}
            {renderCARPengajuanButton()}
          </View>
        );
      }
    } else {
      // USER SECTION
      return (
        <View>
          {renderCancelPengajuanButton()}
          {renderCARCreateDetailReport('USER')}
          {renderCARPengajuanButton()}
        </View>
      );
    }
  }

  // ==== RENDER ALL NOTES
  function renderAllNotes() {
    return (
      <>
        {noteList.map((item, index) => {
          return (
            <View key={item + index}>
              <Gap h={14} />
              <BottomNote title={item.title} message={item.msg} />
            </View>
          );
        })}
        <Gap h={14} />
      </>
    );
  }

  // ==== RENDER ADMIN SELECTOR
  function renderAdminSelector() {
    if (IS_REPORT) return;

    if (user.type == 'ADMIN') {
      if (ACCEPTANCE_STATUS_BY_ID !== 'WAITING') return;
      return (
        <>
          <Text style={styles.subtitle} variant="titleSmall">
            Forward
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
      );
    } else {
      if (reviewStatus !== 'IDLE') return;

      return (
        <>
          <Text style={styles.subtitle} variant="titleSmall">
            Admin Penyetuju
          </Text>
          <Gap h={10} />
          <InputLabel>Ubah admin penyetuju</InputLabel>
          <Dropdown.ApprovalDropdown
            placeholder={adminStatus[0].nm_user}
            data={adminList}
            disabled={isLoading}
            loading={!adminList}
            onChange={val => setUpdateAdmin(val)}
          />
        </>
      );
    }
  }

  // ==== COA SELECTOR
  function renderCoaSelector() {
    const TYPE = user?.type;

    if (TYPE == 'ADMIN' && !IS_MINE) {
      if (ACCEPTANCE_STATUS_BY_ID == 'WAITING') {
        return (
          <>
            <InputLabel>COA / Grup Biaya</InputLabel>
            <Dropdown.CoaDropdown
              placeholder={coa || data?.coa}
              onChange={val => setCoa(val)}
            />
          </>
        );
      } else {
        return (
          <Row>
            <InputLabel>COA / Grup Biaya</InputLabel>
            <Text
              numberOfLines={2}
              style={styles.textValue}
              variant={'labelMedium'}>
              {coa}
            </Text>
          </Row>
        );
      }
    } else if (TYPE == 'FINANCE' && !IS_MINE) {
      return (
        <>
          <InputLabel>COA / Grup Biaya</InputLabel>
          <Dropdown.CoaDropdown
            disabled={financeStatus !== 'DONE'}
            placeholder={data?.coa}
            onChange={val => {
              setCoa(val);
              setCoaDisabled(false);
            }}
          />
          {financeStatus === 'DONE' ? (
            <>
              <Gap h={14} />
              <Button
                onPress={() => updateCOA()}
                loading={coaLoading}
                disabled={coaDisabled}
                mode={'contained'}>
                Update COA
              </Button>
            </>
          ) : null}
        </>
      );
    } else if (TYPE == 'REVIEWER' && !IS_MINE) {
      if (reviewStatus == 'IDLE') {
        return (
          <>
            <InputLabel>COA / Grup Biaya</InputLabel>
            <Dropdown.CoaDropdown
              placeholder={coa || data?.coa}
              onChange={val => setCoa(val)}
            />
          </>
        );
      } else {
        return (
          <Row>
            <InputLabel>COA / Grup Biaya</InputLabel>
            <Text
              numberOfLines={2}
              style={styles.textValue}
              variant={'labelMedium'}>
              {coa}
            </Text>
          </Row>
        );
      }
    } else {
      return (
        <Row>
          <InputLabel style={styles.rowLeft}>COA / Grup Biaya</InputLabel>
          <Text
            numberOfLines={2}
            style={styles.textValue}
            variant={'labelMedium'}>
            {data?.coa}
          </Text>
        </Row>
      );
    }
  }

  // === render finance process status
  function renderFinanceProcessStatus() {
    if (data?.status_finance == 'IDLE') return;

    let status;

    if (financeStatus == 'WAITING') {
      status = 'Sedang diproses';
    } else if (financeStatus == 'DONE') {
      status = `Selesai diproses pada ${financeData?.acceptDate} oleh ${financeData?.nm_user}`;
    } else {
      status = `Ditolak pada ${financeData?.acceptDate} oleh ${financeData?.nm_user}`;
    }

    return (
      <Row style={{alignItems: 'flex-start'}}>
        <InputLabel style={styles.rowLeft}>Finance</InputLabel>
        <Text
          numberOfLines={3}
          style={[styles.textValue]}
          variant={'labelMedium'}>
          {status}
        </Text>
      </Row>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={'Detail Request of Payment'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}>
        <Card
          mode={'outlined'}
          onPress={() =>
            isLoading
              ? null
              : user?.isAdmin &&
                ACCEPTANCE_STATUS_BY_ID == 'WAITING' &&
                !IS_REPORT
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
                {data?.childId || data?.parentId ? (
                  <>
                    <Gap h={14} />
                    <Text style={styles.textTotal} variant={'labelSmall'}>
                      {data?.childId
                        ? 'Nominal Realisasi'
                        : 'Nominal Cash Advance'}
                    </Text>
                    <Gap h={8} />
                    <Text style={styles.textTotalValue} variant={'titleMedium'}>
                      {data?.childId
                        ? formatRupiah(realisasi) || '-'
                        : formatRupiah(data?.pengajuan_ca) || '-'}
                    </Text>
                    <Gap h={14} />
                    <Text style={styles.textTotal} variant={'labelSmall'}>
                      Saldo
                    </Text>
                    <Gap h={8} />
                    <Text style={styles.textTotalValue} variant={'titleMedium'}>
                      {data?.childId
                        ? calculateSaldo(nominal, realisasi)
                        : calculateSaldo(data?.pengajuan_ca, nominal)}
                    </Text>
                  </>
                ) : null}
                {user?.isAdmin &&
                ACCEPTANCE_STATUS_BY_ID == 'WAITING' &&
                !IS_REPORT ? (
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
              {adminStatus?.map((item, index) => {
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
              {renderFinanceProcessStatus()}
            </>
          )}
        </View>
        <Gap h={24} />
        <Text style={styles.subtitle} variant="titleSmall">
          Item
        </Text>
        <Gap h={10} />
        <View>
          {ITEMS?.map((item, index) => {
            return (
              <View key={item + index}>
                <Gap h={2} />
                <Card style={styles.itemCard} mode={'elevated'}>
                  <Card.Content>
                    <Row>
                      <Text style={{flex: 1}} variant="labelLarge">
                        {item.name}
                      </Text>
                      <Text variant="labelLarge">
                        {formatRupiah(item.nominal, true)}
                      </Text>
                    </Row>
                  </Card.Content>
                </Card>
                <Gap h={6} />
              </View>
            );
          })}
        </View>
        {(user?.isAdmin && !IS_MINE) || IS_REPORT ? (
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
        ) : null}

        <Gap h={24} />
        <Text style={styles.subtitle} variant="titleSmall">
          Data Request of Payment
        </Text>
        <Gap h={14} />
        {data?.jenis_reimbursement == 'Cash Advance Report' ? (
          <Row>
            <InputLabel style={styles.rowLeft}>No. Doc Pengajuan</InputLabel>
            <Text
              numberOfLines={2}
              style={styles.textValue}
              variant={'labelMedium'}>
              {data?.parentDoc}
            </Text>
            <Gap h={6} />
          </Row>
        ) : null}
        {data?.jenis_reimbursement == 'Cash Advance' && data?.childId ? (
          <Row>
            <InputLabel style={styles.rowLeft}>No. Doc Realisasi</InputLabel>
            <Text
              numberOfLines={2}
              style={styles.textValue}
              variant={'labelMedium'}>
              {data?.childDoc}
            </Text>
            <Gap h={6} />
          </Row>
        ) : null}
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
            <Row style={styles.fileLeft}>
              <Icon
                source={'file-document-outline'}
                size={40}
                color={Colors.COLOR_DARK_GRAY}
              />
              <Gap w={8} />
              <Text numberOfLines={1} variant={'labelLarge'}>
                Lampiran
              </Text>
            </Row>
          </TouchableOpacity>
        </View>
        {IS_REPORT ? null : renderCoaSelector()}

        {typeName !== 'Petty Cash Report' &&
        !_.isEmpty(BANK_DATA) &&
        data?.payment_type !== 'CASH' ? (
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
            {data?.payment_type != 'CASH' ? (
              <Row>
                <InputLabel style={styles.rowLeft}>
                  Dikirim oleh Finance dari
                </InputLabel>
                <Text style={styles.textValue} variant={'labelMedium'}>
                  {FINANCE_BANK || '-'}
                </Text>
                <Gap h={6} />
              </Row>
            ) : null}
          </>
        ) : null}

        <Gap h={24} />
        {renderAdminSelector()}
        {renderAllNotes()}

        {IS_REPORT ? null : renderBottomButton()}
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
      <Dialog visible={cancelDialog} onDismiss={() => setCancelDialog(false)}>
        <Dialog.Title>Konfirmasi</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Apakah anda yakin ingin membatalkan dan menghapus pengajuan ini?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setCancelDialog(false)}>Batalkan</Button>
          <Button onPress={() => deleteReimbursement()}>Konfirmasi</Button>
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
    marginBottom: SIZE_14,
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
