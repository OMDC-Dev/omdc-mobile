import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
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
  ACCEPT_MAKER_REIMBURSEMENT,
  ACCEPT_REVIEW_REIMBURSEMENT,
  FINANCE_ACCEPTANCE,
  FINANCE_UPDATE_COA,
  REIMBURSEMENT_ACCEPTANCE,
  REIMBURSEMENT_ACCEPTANCE_EXTRA,
  REIMBURSEMENT_DETAIL,
  SUPERUSER,
} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {convertRupiahToNumber, formatRupiah} from '../../utils/rupiahFormatter';
import ModalView from '../../components/modal';
import {downloadPdf, getDataById, getLabelByValue} from '../../utils/utils';
import _ from 'lodash';
import {SIZE_14} from '../../styles/size';
import moment from 'moment';
import {retrieveData} from '../../utils/store';
import ViewShot from 'react-native-view-shot';
import {request, PERMISSIONS} from 'react-native-permissions';
import Share from 'react-native-share';

const PengajuanDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {data} = route?.params;
  const {user} = React.useContext(AuthContext);

  // IS MINE
  const IS_MINE = route?.params?.type == 'MINE';
  const IS_REPORT = route.params?.type == 'REPORT';
  const IS_DOWNLOAD = route.params?.type == 'DOWNLOAD';

  const BANK_DATA = data?.bank_detail;
  const FILE_INFO = data?.file_info;
  const ITEMS = data?.item;
  const ADMINS = data?.accepted_by;
  const USER = data?.requester;
  const FINANCE_BANK = data?.finance_bank;

  // state
  const [adminList, setAdminList] = React.useState([]);
  const [admin, setAdmin] = React.useState();
  const [nominal, setNominal] = React.useState(removeRps(data?.nominal));
  const [nomEdit, setNomEdit] = React.useState(false);
  const [accMode, setAccMode] = React.useState('IDLE'); // IDLE || ACC || REJ
  const [note, setNote] = React.useState('');
  const [realisasi, setRealisasi] = React.useState(data?.realisasi);
  const [selectedBank, setSelectedBank] = React.useState(FINANCE_BANK);
  // Cash Advance
  const [coa, setCoa] = React.useState(data?.coa);
  const [coaLoading, setCoaLoading] = React.useState(false);
  const [coaDisabled, setCoaDisabled] = React.useState(true);

  // states
  const [isLoading, setIsLoading] = React.useState(false);
  const [snak, setSnak] = React.useState(false);
  const [snakMsg, setSnakMsg] = React.useState();
  const [statusLoading, setStatusLoading] = React.useState(true);
  const [extraAcc, setExtraAcc] = React.useState();
  const [needExtra, setNeedExtra] = React.useState(false);
  const [extraStatus, setExtraStatus] = React.useState('IDLE');

  // acceptance
  const [adminStatus, setAdminStatus] = React.useState(ADMINS);
  const [requestStatus, setRequestStatus] = React.useState(data?.status);
  const [financeStatus, setFinanceStatus] = React.useState(
    data?.status_finance,
  );
  const [financeData, setFinanceData] = React.useState(data?.finance_by);
  const [financeBank, setFinanceBank] = React.useState(FINANCE_BANK);

  // reviewer
  const [reviewStatus, setReviewStatus] = React.useState(data.reviewStatus);
  const [makerStatus, setMakerStatus] = React.useState(data.makerStatus);
  const [updateAdmin, setUpdateAdmin] = React.useState(
    data?.accepted_by[0].iduser,
  );
  const [noteList, setNoteList] = React.useState([]);
  const [reportChange, setReportChange] = React.useState(false);
  const [icon, setIcon] = React.useState();

  // dialog
  const [cancelDialog, setCancelDialog] = React.useState(false);
  const [downloadLoading, setDownloadLoading] = React.useState(false);
  const [isNeedBank, setIsNeedBank] = React.useState(true);

  // Shoot
  const shootRef = React.useRef();

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

  React.useEffect(() => {
    if (IS_DOWNLOAD) {
      loadIcon();
    }
  }, []);

  async function loadIcon() {
    const getIcon = await retrieveData('APP_ICON');
    setIcon(getIcon);
  }

  // get admin
  async function getSuperUser() {
    try {
      const {state, data, error} = await fetchApi({
        url: SUPERUSER + `?limit=100&rid=${ID}`,
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
        setMakerStatus(data.makerStatus);
        setSelectedBank(data?.finance_bank);
        setFinanceBank(data?.finance_bank);
        setExtraAcc(data?.extraAcceptance);
        setNeedExtra(data.needExtraAcceptance);
        setExtraStatus(data.extraAcceptanceStatus);
        if (
          data.needExtraAcceptance &&
          user.type == 'FINANCE' &&
          data.extraAcceptanceStatus !== 'IDLE' &&
          data.extraAcceptanceStatus !== 'WAITING'
        ) {
          setAccMode(data.extraAcceptanceStatus == 'APPROVED' ? 'ACC' : 'REJ');
        }
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

  // set status
  async function acceptance_extras(status) {
    setIsLoading(true);
    const R_ID = data?.id;

    const body = {
      status: status,
      note: note,
    };

    try {
      const {state, data, error} = await fetchApi({
        url: REIMBURSEMENT_ACCEPTANCE_EXTRA(R_ID),
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
      extra: admin,
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

  // set status maker
  async function acceptance_maker(status) {
    setIsLoading(true);
    const R_ID = data?.id;
    const body = {
      note: note,
      coa: coa,
      status: status,
      bank: selectedBank,
    };

    try {
      const {state, data, error} = await fetchApi({
        url: ACCEPT_MAKER_REIMBURSEMENT(R_ID),
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
    setReportChange(false);
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

  console.log('UPDATE ADMIN', updateAdmin);

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
      title: 'Kategori Permintaan',
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
      case 'DONE':
        return {
          title: `Selesai diproses pada ${financeData?.acceptDate} oleh ${financeData?.nm_user}`,
          style: styles.textStatusApproved,
        };
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
      if (extraAcc?.iduser == user.iduser) {
        acceptance_extras(accMode == 'ACC' ? 'APPROVED' : 'REJECTED');
      } else {
        acceptance(accMode == 'ACC' ? 'APPROVED' : 'REJECTED');
      }
    } else if (user.type == 'REVIEWER') {
      acceptance_reviewer(accMode == 'ACC' ? 'APPROVED' : 'REJECTED');
    } else if (user.type == 'MAKER') {
      acceptance_maker(accMode == 'ACC' ? 'APPROVED' : 'REJECTED');
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

  // const onCapture = React.useCallback(uri => {
  //   setShootUri(uri);
  // }, []);

  // function onDownloadOnly() {
  //   setIsLoading(true);
  //   shootRef.current.capture().then(async uri => {
  //     await downloadPdf(uri, data.no_doc)
  //       .then(path => {
  //         console.log(`Save to ${path}`);
  //         Alert.alert('Sukses', `Sukses menyimpan report ke ${path}`);
  //         setIsLoading(false);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setIsLoading(false);
  //         Alert.alert('Gagal', 'Gagal menyimpan report ke perangkat!', [
  //           {
  //             text: 'OK',
  //             onPress: () => {
  //               setIsLoading(false);
  //               navigation.goBack();
  //             },
  //           },
  //         ]);
  //       });
  //   });
  // }
  //console.log(calculateSaldo(nominal, realisasi));
  React.useEffect(() => {
    if (
      data?.jenis_reimbursement == 'Cash Advance Report' &&
      data?.payment_type == 'TRANSFER'
    ) {
      const saldo = calculateSaldo(data?.pengajuan_ca, nominal);
      const getSaldo = convertRupiahToNumber(saldo);

      if (getSaldo > 0) {
        setIsNeedBank(false);
      }
    }
  }, []);

  console.log('IS NEED BANK', isNeedBank);

  const onDownloadOnly = React.useCallback(() => {
    setDownloadLoading(true);
    shootRef.current.capture().then(async uri => {
      await downloadPdf(uri, data.no_doc)
        .then(path => {
          console.log(`Save to ${path}`);
          Alert.alert('Sukses', `Sukses menyimpan report ke ${path}`);
          setDownloadLoading(false);
        })
        .catch(err => {
          console.log(err);
          setDownloadLoading(false);
          Alert.alert('Gagal', 'Gagal menyimpan report ke perangkat!', [
            {
              text: 'OK',
              onPress: () => {
                setDownloadLoading(false);
                navigation.goBack();
              },
            },
          ]);
        });
    });
  }, []);

  async function onShareReport() {
    setDownloadLoading(true);
    shootRef.current.capture().then(async uri => {
      await downloadPdf(uri, data.no_doc)
        .then(path => {
          onShare(path);
          setDownloadLoading(false);
        })
        .catch(err => {
          Alert.alert('Gagal', 'Gagal membagikan report!');
          setDownloadLoading(false);
        });
    });

    function onShare(path) {
      const options = {
        url: Platform.OS == 'ios' ? path : `file://${path}`,
        type: 'application/pdf',
      };

      Share.open(options)
        .then(res => {
          console.log(res);
          setSnakMsg('Sukses membagikan report!');
          setSnak(true);
        })
        .catch(err => {
          err && console.log(err.message);
          if (err.message == 'User did not share') return;
          setSnakMsg('Gagal membagikan report!');
          setSnak(true);
        });
    }
  }

  async function onRequestStoragePermission() {
    if (Platform.OS == 'ios') {
      navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'});
      return;
    }

    if (Number(Platform.Version) >= 33) {
      navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'});
      return;
    }

    await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then(result => {
        if (result == 'granted') {
          navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'});
        } else {
          setSnakMsg('Izin diperlukan untuk menyimpan report');
          setSnak(true);
        }
      })
      .catch(err => {
        console.log(err);
        setSnakMsg('Gagal mendapatkan izin mohon coba lagi');
        setSnak(true);
      });
  }

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
              isLoading ||
              (!selectedBank && data?.payment_type == 'TRANSFER' && isNeedBank)
            }
            mode={'contained'}
            onPress={() => setAccMode('ACC')}>
            {admin
              ? 'Konfirmasi dan Teruskan'
              : _.isEmpty(BANK_DATA)
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
        <Button
          disabled={
            user.type == 'MAKER' &&
            !selectedBank &&
            data?.payment_type == 'TRANSFER' &&
            isNeedBank
          }
          mode={'contained'}
          onPress={() => setAccMode('ACC')}>
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

    if (user.type == 'MAKER') {
      status_approved = makerStatus == 'REJECTED' ? 'ditolak.' : 'disetujui.';
    }

    if (user.type == 'ADMIN' && extraAcc?.iduser == user.iduser) {
      status_approved =
        extraAcc.status == 'APPROVED' ? 'disetujui.' : 'ditolak.';
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
    if (!isNeedBank) return;

    return (
      <>
        <Gap h={14} />
        <InputLabel>Bank Pengirim</InputLabel>
        <Dropdown.BankDropdown
          placeholder={selectedBank !== '-' ? selectedBank : 'Pilih Bank'}
          disabled={isLoading}
          onChange={val => setSelectedBank(getLabelByValue(val))}
        />
      </>
    );
  }

  // ========= rendering
  function renderBottomButton() {
    if (IS_DOWNLOAD) return;
    if (user.isAdmin && !IS_MINE) {
      //  FINANCE SECTION
      if (user.type == 'FINANCE') {
        // FINANCE STATUS WAITING
        if (financeStatus == 'WAITING') {
          if (needExtra && extraStatus !== 'IDLE') {
            if (extraStatus == 'WAITING') {
              return (
                <>
                  <Gap h={14} />
                  <Card mode={'outlined'}>
                    <Card.Content style={{alignItems: 'center'}}>
                      <Text variant={'bodyMedium'}>
                        Menunggu persetujuan lanjutan.
                      </Text>
                    </Card.Content>
                  </Card>
                </>
              );
            } else {
              return (
                <>
                  <Gap h={24} />
                  <Button
                    loading={isLoading}
                    disabled={isLoading}
                    mode={'contained'}
                    onPress={() => onConfirmPressed()}>
                    Selesaikan ({' '}
                    {extraStatus == 'APPROVED' ? 'Setujui' : 'Tolak'} )
                  </Button>
                  <Gap h={10} />
                </>
              );
            }
          }

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
                      : _.isEmpty(BANK_DATA) || !_.isEmpty(extraAcc)
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

      // MAKER SECTION
      if (user.type == 'MAKER') {
        if (makerStatus == 'IDLE') {
          return (
            <View>
              {renderSenderBankFinance()}

              <Gap h={14} />
              {renderAcceptRejectState()}
            </View>
          );
        }

        return (
          <>
            <Gap h={10} />
            {renderAdminDoneCard()}
          </>
        );
      }

      // REVIEWER SECTION
      if (user.type == 'ADMIN' && extraAcc?.iduser == user.iduser) {
        if (extraAcc?.status == 'WAITING') {
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
        {noteList.length > 0 && (
          <>
            <Gap h={24} />
            <Text style={styles.subtitle} variant="titleSmall">
              Catatan
            </Text>
            <Gap h={14} />
          </>
        )}

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
    if (IS_DOWNLOAD) return;

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
    }

    if (user.type == 'FINANCE' && extraStatus == 'IDLE') {
      if (financeStatus == 'DONE') return;
      return (
        <>
          <Text style={styles.subtitle} variant="titleSmall">
            Persetujuan Lanjutan
          </Text>
          <Gap h={10} />
          <InputLabel>Perlu persetujuan lanjutan ke ( opsional )</InputLabel>
          <Dropdown.ApprovalDropdown
            data={adminList}
            disabled={isLoading}
            loading={!adminList}
            onChange={val => setAdmin(val)}
          />
        </>
      );
    }
  }

  // ==== COA SELECTOR
  function renderCoaSelector() {
    const TYPE = user?.type;

    if (IS_DOWNLOAD) {
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

    if (IS_REPORT) {
      return (
        <>
          <InputLabel>COA / Grup Biaya</InputLabel>
          <Dropdown.CoaDropdown
            placeholder={coa || data?.coa}
            onChange={val => {
              setCoa(val);
              setReportChange(true);
            }}
          />
          <Gap h={14} />
          <Button
            disabled={!reportChange}
            mode={'contained'}
            onPress={() => updateCOA()}>
            Update COA
          </Button>
        </>
      );
    }

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
          <Gap h={8} />
          {financeStatus !== 'DONE' && financeStatus !== 'REJECTED' && (
            <Text variant={'labelSmall'}>
              * Dapat di update setelah permintaan selesai.
            </Text>
          )}
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
    } else if (TYPE == 'MAKER' && !IS_MINE) {
      if (makerStatus == 'IDLE') {
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

  // == Render Download Attachmnet
  function renderDownloadAttachment() {
    if (!IS_DOWNLOAD) return;
    return (
      <>
        <Gap h={24} />
        <Text style={styles.subtitle} variant="titleSmall">
          Lampiran
        </Text>
        <Gap h={14} />
        <Image
          source={{uri: data.attachment}}
          style={{width: '100%', height: 720}}
          resizeMode={'contain'}
        />
      </>
    );
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
          style={[
            styles.textValue,
            financeStatus == 'REJECTED' ? styles.textStatusRejected : undefined,
          ]}
          variant={'labelMedium'}>
          {status}
        </Text>
      </Row>
    );
  }

  // === render reviewer process status
  function renderReviewerProcessStatus() {
    if (reviewStatus == 'IDLE') return;

    let status;

    if (reviewStatus == 'IDLE') {
      status = 'Sedang diproses';
    } else if (reviewStatus == 'APPROVED') {
      status = `Diterima oleh Reviewer`;
    } else {
      status = `Ditolak oleh Reviewer`;
    }

    return (
      <Row>
        <InputLabel style={styles.rowLeft}>Reviewer</InputLabel>
        <Text
          numberOfLines={3}
          style={[
            styles.textValue,
            reviewStatus == 'REJECTED' ? styles.textStatusRejected : undefined,
            reviewStatus == 'APPROVED' ? styles.textStatusApproved : undefined,
          ]}
          variant={'labelMedium'}>
          {status}
        </Text>
      </Row>
    );
  }

  // ======== render download button
  function renderDownloadButton(container) {
    if (IS_REPORT) return;
    if (IS_DOWNLOAD) {
      if (Platform.OS == 'ios') {
        return (
          <View style={container ? styles.bottomContainer : undefined}>
            <Button
              disabled={isLoading || statusLoading || downloadLoading}
              loading={downloadLoading}
              mode={'contained'}
              onPress={() =>
                // navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'})
                onShareReport()
              }>
              {Platform.OS == 'ios' ? 'Simpan dan Bagikan' : 'Bagikan Report'}
            </Button>
          </View>
        );
      }

      return (
        <View style={container ? styles.bottomContainer : undefined}>
          <Button
            disabled={isLoading || statusLoading}
            mode={'contained'}
            onPress={() =>
              // navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'})
              isLoading ? null : onDownloadOnly()
            }>
            Simpan ke Perangkat
          </Button>
          <Gap h={14} />
          <Button
            disabled={isLoading || statusLoading}
            mode={'outlined'}
            onPress={() =>
              // navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'})
              onShareReport()
            }>
            Bagikan Report
          </Button>
        </View>
      );
    }

    if (data.jenis_reimbursement == 'Cash Advance' && !realisasi) return;
    if (data.needExtraAcceptance && data.extraAcceptanceStatus == 'WAITING')
      return;

    return (
      <View>
        <Gap h={32} />
        <Button
          mode={'contained'}
          onPress={() =>
            // navigation.push('ReportDownload', {data: data, type: 'DOWNLOAD'})
            onRequestStoragePermission()
          }>
          Download Report
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={'Detail Request of Payment'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}>
        <ViewShot
          ref={shootRef}
          style={{
            backgroundColor: 'white',
            padding: IS_DOWNLOAD ? 8 : undefined,
          }}
          options={{result: 'base64'}}>
          {IS_DOWNLOAD ? (
            <Image
              style={styles.logo}
              source={{uri: `data:image/png;base64,${icon}`}}
              resizeMode={'contain'}
            />
          ) : null}
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
                      <Text
                        style={styles.textTotalValue}
                        variant={'titleMedium'}>
                        {data?.childId
                          ? formatRupiah(realisasi) || '-'
                          : formatRupiah(data?.pengajuan_ca) || '-'}
                      </Text>
                      <Gap h={14} />
                      <Text style={styles.textTotal} variant={'labelSmall'}>
                        Saldo
                      </Text>
                      <Gap h={8} />
                      <Text
                        style={styles.textTotalValue}
                        variant={'titleMedium'}>
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
                  ) : // <>
                  //   <Gap h={14} />
                  //   <Text
                  //     style={[styles.textStatus, STATUS_TEXT().style]}
                  //     variant={'labelMedium'}>
                  //     {STATUS_TEXT().title}
                  //   </Text>
                  // </>
                  null}
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
                {/* {renderReviewerProcessStatus()} */}
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
                {/* {renderFinanceProcessStatus()} */}
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
          {IS_DOWNLOAD ? null : (
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
          )}
          {renderCoaSelector()}

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
                    {financeBank || '-'}
                  </Text>
                  <Gap h={6} />
                </Row>
              ) : null}
            </>
          ) : null}

          <Gap h={24} />
          {renderAdminSelector()}
          {renderAllNotes()}
          {renderDownloadAttachment()}

          {IS_REPORT ? null : renderBottomButton()}
          {(user.type == 'USER' || user.type == 'FINANCE') &&
          data.status_finance == 'DONE' &&
          !IS_DOWNLOAD
            ? renderDownloadButton()
            : null}
        </ViewShot>
      </ScrollView>
      {IS_DOWNLOAD ? renderDownloadButton(true) : null}
      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
      <ModalView
        type={'loading'}
        visible={
          isLoading || Platform.OS == 'android' ? downloadLoading : undefined
        }
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

  logo: {
    alignSelf: 'center',
    height: Scaler.scaleSize(125),
    width: Scaler.scaleSize(125),
    marginVertical: Size.SIZE_14,
  },

  bottomContainer: {
    backgroundColor: Colors.COLOR_WHITE,
    paddingHorizontal: Size.SIZE_14,
    paddingVertical: Size.SIZE_24,
    borderTopWidth: 0.5,
    borderColor: Colors.COLOR_LIGHT_GRAY,
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
