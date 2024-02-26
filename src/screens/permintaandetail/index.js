import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {ActivityIndicator, Text} from 'react-native-paper';
import {Card, Container, Gap, Header, InputLabel, Row} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {useRoute} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {DETAIL_REQUEST_BARANG} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const PermintaanDetailScreen = () => {
  const route = useRoute();
  const DATA = route?.params?.data;

  // state
  const [isLoading, setIsLoading] = React.useState(false);
  const [listBarang, setListBarang] = React.useState();

  console.log(DATA);

  const DATA_PERMINTAAN = [
    {
      ti: 'ID Permintaan Barang',
      va: DATA?.id_pb,
    },
    {
      ti: 'Waktu Permintaan',
      va: `${DATA?.tgl_trans} | ${DATA?.jam_trans}`,
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

  return (
    <Container>
      <Header title={'Detail Permintaan'} />
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContainer}>
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
            <Row
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
            </Row>
          );
        })}
        <Gap h={28} />
        <Text style={styles.subtitle} variant="titleSmall">
          Data Barang
        </Text>
        <Gap h={14} />
        {!isLoading && listBarang ? (
          <>
            {listBarang?.map((item, index) => {
              return (
                <Card.BarangCard
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
      </ScrollView>
    </Container>
  );
};

export default PermintaanDetailScreen;

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
