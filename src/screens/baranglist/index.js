import {FlatList, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {BlankScreen, Card, Container, Gap, Header} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {Button, Dialog, FAB, Snackbar, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {CREATE_REQUEST_BARANG} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import ModalView from '../../components/modal';

const BarangListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const cabangData = route?.params?.cabang;

  // state
  const [barangs, setBarangs] = React.useState([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState();
  const [queryBarangs, setQueryBarangs] = React.useState([]);
  const [cabang, setCabang] = React.useState(cabangData);

  // modal
  const [modalType, setModalType] = React.useState('loading');
  const [modalMessage, setModalMessage] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [snak, setSnak] = React.useState(false);
  const [snakMsg, setSnakMsg] = React.useState();

  React.useEffect(() => {
    if (route?.params?.data) {
      const dataWithId = {...route.params.data, id: barangs.length + 1};
      setBarangs(prev => [...prev, dataWithId]);

      // query
      const queryWithId = {
        id: queryBarangs.length + 1,
        kode_barang: route.params.data.kd_brg,
        requestData: route.params.data.requestData,
      };

      setQueryBarangs(prev => [...prev, queryWithId]);
    }
  }, [route]);

  function onDeleteBarang(id) {
    setShowDialog(false);
    const newList = barangs.filter(item => {
      return item.id !== id;
    });

    let temp = [];
    for (let i = 0; i < newList.length; i++) {
      newList[i].id = i;
      temp.push(newList[i]);
    }

    // QUERY
    const newQuery = queryBarangs.filter(item => {
      return item.id !== id;
    });

    let query = [];
    for (let i = 0; i < newQuery.length; i++) {
      newQuery[i].id = i;
      query.push(newQuery[i]);
    }

    setQueryBarangs(query);
    setBarangs(temp);
  }

  async function onCreateRequest() {
    setModalType('loading');
    setIsLoading(true);
    const body = {
      kodeIndukCabang: cabang.indukCabang,
      kodeAnakCabang: cabang.anakCabang,
      barang: queryBarangs,
    };
    const {state, data, error} = await fetchApi({
      url: CREATE_REQUEST_BARANG,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setModalMessage('Permintaan barang berhasil dibuat!');
      setModalType('popup');
    } else {
      setIsLoading(false);
      setSnakMsg('Ada kesalahan tidak diketahui, mohon coba lagi!');
      setSnak(true);
    }
  }

  return (
    <Container>
      <Header title={'Barang Ditambahkan'} />
      <View style={styles.mainContainer}>
        {barangs.length ? (
          <FlatList
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            data={barangs}
            renderItem={({item, index}) => (
              <Card.BarangCard
                onDeletePress={() => {
                  setSelectedId(item.id);
                  setShowDialog(true);
                }}
                fromList={true}
                data={item}
              />
            )}
          />
        ) : (
          <BlankScreen>
            Belum ada barang yang ditambahkan.{'\n'}Tekan tombol + untuk
            menambahkan barang .
          </BlankScreen>
        )}
        <View style={styles.bottomContainer}>
          <Button
            mode={'outlined'}
            onPress={() => navigation.navigate('BarangCari')}>
            + Tambah Barang
          </Button>
          <Gap h={8} />
          <Button
            disabled={!barangs.length}
            mode={'contained'}
            onPress={() => onCreateRequest()}>
            Buat Permintaan Barang
          </Button>
        </View>
      </View>
      <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
        <Dialog.Title>Konfirmasi</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Anda yakin ingin menghapus barang dari daftar?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDialog(false)}>Batalkan</Button>
          <Button onPress={() => onDeleteBarang(selectedId)}>Konfirmasi</Button>
        </Dialog.Actions>
      </Dialog>
      <ModalView
        message={modalMessage}
        type={modalType}
        visible={isLoading}
        onPress={() => navigation.navigate('Barang')}
      />
      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
    </Container>
  );
};

export default BarangListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
  },

  scrollContent: {
    paddingBottom: Scaler.scaleSize(60),
    padding: Size.SIZE_14,
  },

  bottomContainer: {
    padding: Size.SIZE_14,
    marginBottom: Size.SIZE_8,
    borderTopWidth: 0.5,
    borderColor: Colors.COLOR_DARK_GRAY,
  },
});
