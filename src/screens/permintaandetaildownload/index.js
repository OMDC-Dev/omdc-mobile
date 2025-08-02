import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Snackbar,
  Text,
} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {DETAIL_REQUEST_BARANG} from '../../api/apiRoutes';
import {Card, Container, Gap, Header, InputLabel, Row} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {API_STATES} from '../../utils/constant';
import {downloadPdf, getDateFormat} from '../../utils/utils';
import {retrieveData} from '../../utils/store';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

const PermintaanDetailDownloadScreen = () => {
  const route = useRoute();
  const DATA = route?.params?.data;
  const navigation = useNavigation();

  // Shoot
  const shootRef = React.useRef();

  // state
  const [isLoading, setIsLoading] = React.useState(false);
  const [listBarang, setListBarang] = React.useState();
  const [showCancel, setShowCancel] = React.useState(false);
  const [adminResult, setAdminResult] = React.useState({
    approval_admin_status: DATA.approval_admin_status,
  });
  const [snak, setSnak] = React.useState();
  const [icon, setIcon] = React.useState();

  console.log(DATA);

  const DATA_PERMINTAAN = [
    {
      ti: 'ID Permintaan Barang',
      va: DATA?.id_pb,
    },
    {
      ti: 'Waktu Permintaan',
      va: `${getDateFormat(DATA?.tgl_trans)} | ${DATA?.jam_trans}`,
    },
    {
      ti: 'Cabang',
      va: DATA?.nm_induk,
    },
    {
      ti: 'Kirim Ke',
      va: DATA?.nm_cabang,
    },
    {
      ti: 'Alamat',
      va: DATA?.alamat,
    },
  ];

  // [Start] == Download
  const onDownloadOnly = React.useCallback(() => {
    setIsLoading(true);
    shootRef.current.capture().then(async uri => {
      await downloadPdf(uri, DATA.id_pb)
        .then(path => {
          console.log(`Save to ${path}`);
          Alert.alert('Sukses', `Sukses menyimpan report ke ${path}`);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
          Alert.alert('Gagal', 'Gagal menyimpan report ke perangkat!', [
            {
              text: 'OK',
              onPress: () => {
                setIsLoading(false);
                navigation.goBack();
              },
            },
          ]);
        });
    });
  }, []);

  async function onShareReport() {
    setIsLoading(true);
    shootRef.current.capture().then(async uri => {
      await downloadPdf(uri, DATA.id_pb)
        .then(path => {
          onShare(path);
          setIsLoading(false);
        })
        .catch(err => {
          Alert.alert('Gagal', 'Gagal membagikan report!');
          setIsLoading(false);
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
          setSnak('Sukses membagikan report!');
        })
        .catch(err => {
          err && console.log(err.message);
          if (err.message == 'User did not share') return;
          setSnak('Gagal membagikan report!');
        });
    }
  }
  // [End] == Download

  React.useEffect(() => {
    getDetailRequested();
  }, []);

  async function getDetailRequested() {
    setIsLoading(true);
    const {state, data, error} = await fetchApi({
      url: DETAIL_REQUEST_BARANG(DATA?.id_pb),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setListBarang(data);
    } else {
      setIsLoading(false);
      setListBarang([]);
    }
  }

  React.useEffect(() => {
    loadIcon();
  }, []);

  async function loadIcon() {
    const getIcon = await retrieveData('APP_ICON');
    setIcon(getIcon);
  }

  function statusWording() {
    switch (DATA?.status_approve?.toLowerCase()) {
      case 'ditolak':
        return {text: 'Ditolak', color: Colors.COLOR_RED};
        break;
      case 'disetujui sebagian':
        return {text: 'Disetujui Sebagian', color: Colors.COLOR_SECONDARY};
        break;
      case 'disetujui':
        return {text: 'Disetujui', color: Colors.COLOR_GREEN};
        break;
      default:
        return {text: 'Menunggu', color: Colors.COLOR_ORANGE};
        break;
    }
  }

  function pengajuanWording() {
    switch (adminResult?.approval_admin_status?.toLowerCase()) {
      case 'waiting':
        return {
          text: `Menunggu Persetujuan`,
          color: Colors.COLOR_ORANGE,
        };
        break;
      case 'approved':
        return {text: 'Disetujui', color: Colors.COLOR_GREEN};
        break;
      case 'rejected':
        return {text: 'Ditolak', color: Colors.COLOR_RED};
        break;
      default:
        return {
          text: `Menunggu Persetujuan ${DATA.approval_admin_name}`,
          color: Colors.COLOR_ORANGE,
        };
        break;
    }
  }

  function renderStatus() {
    if (DATA.approval_adminid) {
      return (
        <>
          {DATA.approval_admin_status == 'APPROVED' && (
            <>
              <Text style={styles.subtitle} variant="titleSmall">
                Status Approval
              </Text>
              <Gap h={14} />
              <Row>
                <InputLabel style={styles.rowLeft}>Status</InputLabel>
                <Text
                  numberOfLines={5}
                  style={{...styles.textValue, color: statusWording().color}}
                  variant={'labelMedium'}>
                  {statusWording().text}
                </Text>
                <Gap h={6} />
              </Row>
              <Row>
                <InputLabel style={styles.rowLeft}>Tanggal Approval</InputLabel>
                <Text
                  numberOfLines={5}
                  style={styles.textValue}
                  variant={'labelMedium'}>
                  {DATA?.tgl_approve || '-'}
                </Text>
                <Gap h={6} />
              </Row>
              <Gap h={28} />
            </>
          )}
          <Text style={styles.subtitle} variant="titleSmall">
            Status Pengajuan
          </Text>
          <Gap h={14} />
          <Row>
            <InputLabel style={styles.rowLeft}>Status Approval</InputLabel>
            <Text
              numberOfLines={5}
              style={{...styles.textValue, color: pengajuanWording().color}}
              variant={'labelMedium'}>
              {pengajuanWording().text}
            </Text>
            <Gap h={6} />
          </Row>
          <Row>
            <InputLabel style={styles.rowLeft}>Approval by</InputLabel>
            <Text
              numberOfLines={5}
              style={styles.textValue}
              variant={'labelMedium'}>
              {DATA?.approval_admin_name || '-'}
            </Text>
            <Gap h={6} />
          </Row>
          <Row>
            <InputLabel style={styles.rowLeft}>Tanggal Approval</InputLabel>
            <Text
              numberOfLines={5}
              style={styles.textValue}
              variant={'labelMedium'}>
              {adminResult?.approval_admin_date ||
                DATA?.approval_admin_date ||
                '-'}
            </Text>
            <Gap h={6} />
          </Row>
        </>
      );
    }

    return (
      <>
        <Text style={styles.subtitle} variant="titleSmall">
          Status Approval
        </Text>
        <Gap h={14} />
        <Row>
          <InputLabel style={styles.rowLeft}>Status</InputLabel>
          <Text
            numberOfLines={5}
            style={{...styles.textValue, color: statusWording().color}}
            variant={'labelMedium'}>
            {statusWording().text}
          </Text>
          <Gap h={6} />
        </Row>
        <Row>
          <InputLabel style={styles.rowLeft}>Tanggal Approval</InputLabel>
          <Text
            numberOfLines={5}
            style={styles.textValue}
            variant={'labelMedium'}>
            {DATA?.tgl_approve || '-'}
          </Text>
          <Gap h={6} />
        </Row>
      </>
    );
  }

  return (
    <Container>
      <Header title={'Simpan dan Bagikan Report'} />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContainer}>
        <ViewShot
          ref={shootRef}
          style={{
            backgroundColor: 'white',
            padding: Size.SIZE_8,
          }}
          options={{result: 'base64'}}>
          <Image
            style={styles.logo}
            source={{uri: `data:image/png;base64,${icon}`}}
            resizeMode={'contain'}
          />
          {renderStatus()}
          <Gap h={28} />
          <Text style={styles.subtitle} variant="titleSmall">
            Data Permintaan
          </Text>
          <Gap h={14} />
          {DATA_PERMINTAAN.map((item, index) => {
            return item?.ti !== 'Alamat' ? (
              <Row key={item + index}>
                <InputLabel style={styles.rowLeft}>{item.ti}</InputLabel>
                <Text
                  numberOfLines={5}
                  style={styles.textValue}
                  variant={'labelMedium'}>
                  {item.va}
                </Text>
                <Gap h={6} />
              </Row>
            ) : (
              <View
                style={{
                  alignItems: 'flex-start',
                  marginBottom: Scaler.scaleSize(6),
                }}
                key={item + index}>
                <InputLabel style={styles.rowLeft}>{item.ti}</InputLabel>
                <Text
                  numberOfLines={5}
                  style={styles.textValue}
                  variant={'labelMedium'}>
                  {item.va}
                </Text>
                <Gap h={6} />
              </View>
            );
          })}
          <Gap h={28} />
          <Text style={styles.subtitle} variant="titleSmall">
            Data Barang
          </Text>
          <Gap h={14} />
          {listBarang ? (
            <>
              {listBarang?.map((item, index) => {
                return (
                  <Card.BarangCard
                    fromDownload={true}
                    key={item + index}
                    fromDetail={true}
                    data={item}
                  />
                );
              })}
            </>
          ) : (
            <View style={styles.barangLoadingContainer}>
              <ActivityIndicator />
            </View>
          )}
        </ViewShot>
      </ScrollView>
      <View style={styles.bottomBar}>
        {Platform.OS == 'android' && (
          <>
            <Button mode={'contained'} onPress={() => onDownloadOnly()}>
              Simpan ke Perangkat
            </Button>
            <Gap h={14} />
          </>
        )}

        <Button
          mode={Platform.OS == 'android' ? 'outlined' : 'contained'}
          onPress={() => onShareReport()}>
          {Platform.OS == 'ios' ? 'Simpan dan Bagikan' : 'Bagikan'}
        </Button>
      </View>

      <Dialog visible={showCancel} onDismiss={() => setShowCancel(!showCancel)}>
        <Dialog.Title>Konfirmasi</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Apakah anda yakin ingin membatalkan pengajuan ini?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowCancel(!showCancel)}>Batalkan</Button>
          <Button onPress={() => onConfirmCancel()}>Konfirmasi</Button>
        </Dialog.Actions>
      </Dialog>
      <Snackbar visible={snak} onDismiss={() => setSnak(null)}>
        {snak || ''}
      </Snackbar>
    </Container>
  );
};

export default PermintaanDetailDownloadScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  rowLeft: {
    flex: 1,
  },

  barangLoadingContainer: {
    height: Scaler.scaleSize(96),
    justifyContent: 'center',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Scaler.scaleSize(60),
  },

  bottomBar: {
    backgroundColor: Colors.COLOR_WHITE,
    borderTopWidth: 0.5,
    padding: Size.SIZE_14,
    borderColor: Colors.COLOR_GRAY,
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
    marginVertical: Size.SIZE_24,
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
});
