import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {BlankScreen, Card, Gap, Header, Row} from '../../components';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {
  DELETE_PENGUMUMAN,
  GET_NOTIFICATION,
  READ_NOTIFICATION,
} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import ModalView from '../../components/modal';
import {Button, Dialog, Snackbar, Text} from 'react-native-paper';
import {cekAkses} from '../../utils/utils';
import {AuthContext} from '../../context';

const NotifikasiScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // state
  const [notif, setNotif] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [selectedNotif, setSelectedNotif] = React.useState();

  // modal
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('loading');

  // snak
  const [snak, setSnak] = React.useState(false);
  const [snakMsg, setSnakMsg] = React.useState();

  // dialog
  const [showDialog, setShowDialog] = React.useState(false);

  // check access
  const {user} = React.useContext(AuthContext);
  const hasPengumumanAccess = cekAkses('#3', user?.kodeAkses);

  useFocusEffect(
    React.useCallback(() => {
      getNotif();
    }, [showModal]),
  );

  async function getNotif() {
    setLoading(true);
    const {state, data, error} = await fetchApi({
      url: GET_NOTIFICATION,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setNotif(data?.rows);
    } else {
      setLoading(false);
      setNotif([]);
    }
  }

  function onNotifPress(data) {
    setShowModal(true);
    setSelectedNotif(data);
    setModalType('notif');
  }

  async function onReadNotification(item) {
    if (item.isRead) {
      console.log('already read');
      onNotifPress(item);
    }

    setModalType('loading');
    setShowModal(true);
    const {state, data, error} = await fetchApi({
      url: READ_NOTIFICATION(item.id),
      method: 'POST',
    });

    if (state == API_STATES.OK) {
      onNotifPress(item);
    } else {
      setShowModal(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
    }
  }

  async function onDeleteNotif() {
    setModalType('loading');
    setShowModal(true);
    const {state, data, error} = await fetchApi({
      url: DELETE_PENGUMUMAN(),
      method: 'DELETE',
    });

    if (state == API_STATES.OK) {
      setShowModal(false);
      setSnakMsg('Pengumuman berhasil ditarik!');
      setSnak(true);
    } else {
      setShowModal(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title={'Notifikasi'}
        right={
          hasPengumumanAccess && (
            <Button onPress={() => navigation.navigate('BuatNotifikasi')}>
              Buat Pengumuman
            </Button>
          )
        }
      />
      <View style={styles.mainContainer}>
        {notif?.length ? (
          <FlatList
            data={notif}
            renderItem={({item, index}) => (
              <Card.NotifCard
                data={item}
                onPress={() => onReadNotification(item)}
                showDeleteButton={hasPengumumanAccess}
                onDeletePress={() => {
                  setSelectedNotif(item);
                  setShowDialog(true);
                }}
              />
            )}
          />
        ) : (
          <BlankScreen loading={loading}>Belum ada pemberitahuan</BlankScreen>
        )}
      </View>
      <ModalView
        onBackdropPress={() =>
          modalType == 'notif' ? setShowModal(false) : null
        }
        data={selectedNotif}
        visible={showModal}
        type={modalType}
      />
      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
      <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
        <Dialog.Title>Konfirmasi</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Konfirmasi hapus pengumuman?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDialog(false)}>Batalkan</Button>
          <Button onPress={() => onDeleteNotif()}>Konfirmasi</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

export default NotifikasiScreen;

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
});
