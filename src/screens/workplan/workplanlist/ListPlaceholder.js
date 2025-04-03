import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {
  ActivityIndicator,
  FAB,
  IconButton,
  Searchbar,
  Text,
} from 'react-native-paper';
import {BlankScreen, Card, Gap, Row} from '../../../components';
import {RefreshControl} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Colors, Size} from '../../../styles';
import {fetchApi} from '../../../api/api';
import {WORKPLAN} from '../../../api/apiRoutes';
import {API_STATES, WORKPLAN_STATUS} from '../../../utils/constant';

const ListPlaceholder = type => {
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
  const PARAM_USER = route.params.user;

  const STATUS_PARAM =
    PARAM_TYPE == 'WAITING'
      ? [
          WORKPLAN_STATUS.ON_PROGRESS,
          WORKPLAN_STATUS.PENDING,
          WORKPLAN_STATUS.REVISON,
        ]
      : WORKPLAN_STATUS.FINISH;

  const FILTER_PARAM = route.params?.filter;
  let FILTER = FILTER_PARAM ? `&${FILTER_PARAM}` : '';

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      getList();
    }, [FILTER_PARAM]),
  );

  async function getList(clear) {
    setLoading(true);
    setRefreshing(true);
    setPage(1); // Reset halaman ke 1 saat refresh

    const {state, data} = await fetchApi({
      url:
        WORKPLAN +
        `?limit=4&page=1&search=${
          clear ? '' : search
        }&status=${STATUS_PARAM}${FILTER}`, // Selalu mulai dari page 1
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

    const nextPage = page + 1;
    const {state, data} = await fetchApi({
      url:
        WORKPLAN +
        `?limit=4&page=${nextPage}&search=${search}&status=${STATUS_PARAM}${FILTER}`,
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
  }, [FILTER_PARAM]);

  return (
    <View style={styles.mainContainer}>
      <Row>
        <Searchbar
          style={{flex: 1}}
          placeholder="Cari no. work plan, perihal..."
          value={search}
          onChangeText={text => setSearch(text)}
          onBlur={() => getList()}
          onClearIconPress={() => getList(true)}
        />
        <IconButton
          onPress={() =>
            navigation.navigate('WPFilterModal', {
              ...route.params,
              name: route?.name,
              filter: FILTER_PARAM,
            })
          }
          icon={'filter-outline'}
        />
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
              <Card.WorkplanCard
                key={index}
                data={item}
                onPress={() =>
                  navigation.navigate('WorkplanDetail', {id: item.id})
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
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <BlankScreen>Belum ada data!</BlankScreen>
      )}
      {PARAM_USER == 'USER' && PARAM_TYPE == 'WAITING' ? (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('Workplan')}
        />
      ) : null}
    </View>
  );
};

export default ListPlaceholder;

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

  fab: {
    position: 'absolute',
    margin: 16,
    right: 4,
    bottom: 10,
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
