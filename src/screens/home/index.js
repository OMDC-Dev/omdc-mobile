import * as React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Avatar,
  Text,
  Button as PaperButton,
  Icon,
  ActivityIndicator,
  Searchbar,
} from 'react-native-paper';
import {Colors, Scaler, Size} from '../../styles';
import {BlankScreen, Button, Card, Gap, Row} from '../../components';
import ASSETS from '../../utils/assetLoader';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {AuthContext} from '../../context';
import {GET_NOTIFICATION_COUNT, REIMBURSEMENT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {fetchApi} from '../../api/api';
import {cekAkses} from '../../utils/utils';
import _ from 'lodash';
import {retrieveData} from '../../utils/store';

const HomeScreen = () => {
  const [recent, setRecent] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [listInfo, setListInfo] = React.useState();
  const [page, setPage] = React.useState(1);
  const [moreLoading, setMoreLoading] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [icon, setIcon] = React.useState();

  // navigation
  const navigation = useNavigation();
  const route = useRoute();

  // user context
  const {signOut, user} = React.useContext(AuthContext);

  const hasReimbursement = cekAkses('#1', user?.kodeAkses);

  async function getRecentRequest(clear) {
    console.log('Get Recent On Progress');
    setMoreLoading(true);
    const {state, data, error} = await fetchApi({
      url:
        REIMBURSEMENT +
        `?page=${page}&limit=4&status=00&cari=${clear ? '' : search}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setMoreLoading(false);
      setRecent(data?.rows);
      setListInfo(data?.pageInfo);
      setRefreshing(false);
    } else {
      setMoreLoading(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  async function getNextRecentRequest() {
    setMoreLoading(true);
    const {state, data, error} = await fetchApi({
      url: REIMBURSEMENT + `?page=${page}&limit=4&status=00&cari=${search}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setMoreLoading(false);
      setRecent(prev => [...prev, ...data.rows]);
      setListInfo(data?.pageInfo);
      setRefreshing(false);
    } else {
      setMoreLoading(false);
      setRefreshing(false);
      console.log(error);
    }
  }

  async function getNotificationCount() {
    const {state, data, error} = await fetchApi({
      url: GET_NOTIFICATION_COUNT,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setUnreadCount(data.unreadCount);
    } else {
      setUnreadCount(0);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getNotificationCount();
      getRecentRequest();
    }, []),
  );

  // React.useEffect(() => {
  //   if (firstLoad) {
  //     console.log('IT WAS FIRST LOAD');
  //     getRecentRequest();
  //   }
  // }, [firstLoad]);

  React.useEffect(() => {
    if (!refreshing && !firstLoad) {
      // Hanya panggil getNextRecentRequest jika bukan refresh pertama kali
      getNextRecentRequest();
    } else {
      setFirstLoad(false); // Setelah render pertama kali, atur flag firstLoad menjadi false
    }
  }, [page]);

  // React.useEffect(() => {

  // }, [page]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRecent([]);
    setPage(1);
    getRecentRequest();
  }, []);

  function onLoadMore() {
    if (parseInt(page) < parseInt(listInfo?.pageCount) && !moreLoading) {
      console.log('CAN LOAD MORE');
      setPage(page + 1);
    } else {
      console.log('LOAD LIMIT');
    }
  }

  React.useEffect(() => {
    loadIcon();
  }, []);

  async function loadIcon() {
    const getIcon = await retrieveData('APP_ICON');
    setIcon(getIcon);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <View style={styles.main}>
        <View style={styles.topContent}>
          <Image
            source={{uri: `data:image/png;base64,${icon}`}}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <Gap h={24} />
          <Row>
            <Row style={styles.topInfoLeft}>
              <Avatar.Icon icon={'account'} size={40} />
              <Gap w={10} />
              <View>
                <Text style={styles.textName} variant="labelLarge">
                  {user?.nm_user}
                </Text>
                <Text style={styles.textLvl} variant="labelSmall">
                  {user?.level_user}
                </Text>
              </View>
            </Row>
            <TouchableOpacity
              style={styles.bellButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('NotifikasiStack')}>
              {unreadCount && unreadCount > 0 ? (
                <View style={styles.bellBadge} />
              ) : null}
              <Icon
                source={'bell-outline'}
                size={22}
                color={Colors.COLOR_WHITE}
              />
            </TouchableOpacity>
          </Row>

          {hasReimbursement && (
            <>
              <Gap h={24} />
              <Button
                style={styles.buttonRequest}
                onPress={() => navigation.navigate('PengajuanStack')}>
                Ajukan Reimbursement
              </Button>
            </>
          )}
        </View>
        <View style={styles.mainContent}>
          <Row style={styles.rowSub}>
            <Text style={styles.textSubtitleLeft} variant="labelMedium">
              Pengajuan Dalam Proses
            </Text>
            <Text
              onPress={() => navigation.navigate('HistoryReimbursementStack')}
              style={styles.textSubtitle}
              variant="labelMedium">
              Riwayat Pengajuan
            </Text>
          </Row>
          <Searchbar
            placeholder="Cari no. dokumen, jenis, coa..."
            value={search}
            onChangeText={text => setSearch(text)}
            onBlur={() => getRecentRequest()}
            onClearIconPress={() => getRecentRequest(true)}
          />
          {recent?.length ? (
            <>
              <FlatList
                data={recent}
                contentContainerStyle={{paddingBottom: 120}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReachedThreshold={0.5}
                onEndReached={onLoadMore}
                ListFooterComponent={
                  moreLoading ? (
                    <View style={styles.footerLoading}>
                      <Gap h={24} />
                      <ActivityIndicator />
                      <Gap h={14} />
                      <Text variant={'bodySmall'}>Memuat lebih banyak...</Text>
                    </View>
                  ) : null
                }
                renderItem={({item, index}) => {
                  return (
                    <Card.PengajuanCard
                      data={item}
                      onPress={() =>
                        navigation.navigate('PengajuanStack', {
                          screen: 'PengajuanDetail',
                          params: {
                            data: item,
                            type: 'MINE',
                          },
                        })
                      }
                    />
                  );
                }}
              />
            </>
          ) : (
            <BlankScreen>Anda tidak memiliki pengajuan terbaru</BlankScreen>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
  },

  main: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
  },

  topContent: {
    backgroundColor: Colors.COLOR_SECONDARY,
    padding: Size.SIZE_14,
  },

  mainContent: {
    flex: 1,
    padding: Size.SIZE_14,
  },

  logo: {
    width: Scaler.scaleSize(54),
    height: Scaler.scaleSize(24),
  },

  buttonRequest: {
    borderRadius: 8,
  },

  topInfoLeft: {
    flex: 1,
  },

  rowSub: {
    marginVertical: Size.SIZE_10,
  },

  bellButton: {
    padding: Size.SIZE_8,
    borderRadius: 16,
  },

  bellBadge: {
    width: Size.SIZE_12,
    height: Size.SIZE_12,
    borderRadius: 6,
    right: 5,
    top: 5,
    backgroundColor: 'red',
    position: 'absolute',
  },

  footerLoading: {
    alignItems: 'center',
  },

  // text
  textName: {
    color: Colors.COLOR_WHITE,
  },

  textLvl: {
    color: Colors.COLOR_LIGHT_GRAY,
  },

  textSubtitle: {
    color: Colors.COLOR_PRIMARY,
  },

  textSubtitleLeft: {
    flex: 1,
    color: Colors.COLOR_DARK_GRAY,
  },

  textLogout: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
