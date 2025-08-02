import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {Searchbar, Text} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {BARANG_REQUESTED_ALL} from '../../api/apiRoutes';
import {BlankScreen, Card, Gap, Row} from '../../components';
import {Colors, Size} from '../../styles';
import {API_STATES} from '../../utils/constant';
import {cekAkses} from '../../utils/utils';
import {AuthContext} from '../../context';

const ListPlaceholder = () => {
  const [list, setList] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [loadingMore, setLoadingMore] = React.useState(false);

  // pagination
  const [page, setPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState();

  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const PARAM_TYPE = route.params.type;

  const {user} = React.useContext(AuthContext);
  const isAdminPB = cekAkses('#8', user.kodeAkses);
  const hasAllTrxAkses = cekAkses('#13', user.kodeAkses);

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      getList();
    }, []),
  );

  async function getList(clear) {
    setLoading(true);
    setRefreshing(true);
    setPage(1); // Reset halaman ke 1 saat refresh

    let USER = '';

    if (!hasAllTrxAkses) {
      USER = `&iduser=${user.iduser}`;
    }

    const {state, data} = await fetchApi({
      url:
        BARANG_REQUESTED_ALL +
        `?limit=10&page=1&type=${PARAM_TYPE}${USER}&search=${
          clear ? '' : search
        }`, // Selalu mulai dari page 1
      method: 'GET',
    });

    if (state === API_STATES.OK) {
      setList(data.rows);
      setMaxPage(data.pageInfo.pageCount);
      setLoading(false);
    } else {
      setLoading(false);
    }

    setRefreshing(false);
  }

  async function getMoreList() {
    if (loadingMore || page == maxPage) return; // Hindari duplikasi request
    setLoadingMore(true);

    let USER = '';

    if (!hasAllTrxAkses) {
      USER = `&iduser=${user.iduser}`;
    }

    const nextPage = page + 1;
    const {state, data} = await fetchApi({
      url:
        BARANG_REQUESTED_ALL +
        `?limit=10&page=${nextPage}&type=${PARAM_TYPE}${USER}&search=${search}`,
      method: 'GET',
    });

    if (state === API_STATES.OK && data.rows.length > 0) {
      setList(prev => [...prev, ...data.rows]);
      setPage(nextPage);
    }

    setLoadingMore(false);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Row>
        <Searchbar
          style={{flex: 1}}
          placeholder="Cari id, nama barang, nama user ..."
          value={search}
          onChangeText={text => setSearch(text)}
          onBlur={() => getList()}
          onClearIconPress={() => getList(true)}
        />
        {/* <IconButton
          onPress={() =>
            navigation.navigate('WPFilterModal', {
              ...route.params,
              name: route?.name,
              filter: FILTER_PARAM,
            })
          }
          icon={'filter-outline'}
        /> */}
      </Row>
      <Gap h={14} />
      {list?.length ? (
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => {
            return (
              <Card.TrxPermintaanCard
                key={index}
                data={item}
                onPress={() =>
                  navigation.navigate('BarangDetail', {data: item})
                }
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={getMoreList}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerContainer}>
                <Gap h={14} />
                <ActivityIndicator />
                <Gap h={14} />
                <Text variant={'labelSmall'}>Memuat lebih banyak...</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <BlankScreen loading={loading}>Belum ada data</BlankScreen>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: Size.SIZE_14,
    backgroundColor: Colors.COLOR_WHITE,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateContainer: {
    flex: 1,
    marginRight: Size.SIZE_14,
  },

  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // text
  textTitle: {
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
  },

  textDate: {
    flex: 1,
  },
});

export default ListPlaceholder;
