import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {
  Card,
  Icon,
  IconButton,
  Text,
  Button as MButton,
  Searchbar,
} from 'react-native-paper';
import {Colors, Size} from '../../styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  BlankScreen,
  Button,
  Row,
  Card as CustomCard,
  Container,
  Header,
  Gap,
} from '../../components';
import ModalView from '../../components/modal';
import {getMonthYear, getMonthYearNumber} from '../../utils/utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {REIMBURSEMENT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

async function getHistory(
  type = '00',
  monthyear,
  search = '',
  clear,
  typeFilter,
  statusFilter,
) {
  let useMonthFilter = '';

  if (monthyear !== 'ALL') {
    useMonthFilter = `&monthyear=${monthyear}`;
  }

  let query = `?status=${type}&page=1&limit=300${useMonthFilter}&cari=${
    clear ? '' : search
  }`;

  if (typeFilter && typeFilter != 'all') {
    query += `&type=${typeFilter?.toUpperCase()}`;
  }

  if (statusFilter && statusFilter != 'all') {
    query += `&statusROP=${statusFilter?.toUpperCase()}`;
  }

  const {state, data, error} = await fetchApi({
    url: REIMBURSEMENT + query,
    method: 'GET',
  });

  if (state == API_STATES.OK) {
    return data?.rows;
  } else {
    return 'ERROR';
  }
}

// Render List Diajukan
const RenderDiajukan = () => {
  const [list, setList] = React.useState();
  const [showDateSelector, setShowDateSelector] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('ALL');
  const [queryDate, setQueryDate] = React.useState('ALL');
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [showTypeModal, setShowTypeModal] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState('all');

  const navigation = useNavigation();

  function onSelectedDate({state, value}) {
    setShowDateSelector(false);
    if (state !== 'CANCEL') {
      setSelectedDate(getMonthYear(value));
      setQueryDate(getMonthYearNumber(value));
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      getList();
    }, [queryDate, typeFilter]),
  );

  async function getList(clear) {
    const data = await getHistory('00', queryDate, search, clear, typeFilter);
    if (data !== 'ERROR') {
      setList(data);
      setRefreshing(false);
    } else {
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setQueryDate('ALL');
    getList();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Row>
        <Card
          style={styles.dateContainer}
          mode={'contained'}
          onPress={() => setShowDateSelector(true)}>
          <Card.Content>
            <Row>
              <Text variant="labelMedium" style={styles.textDate}>
                {queryDate == 'ALL' ? 'Semua' : selectedDate}
              </Text>
              <Icon
                source={'arrow-down-drop-circle'}
                size={18}
                color={Colors.COLOR_DARK_GRAY}
              />
            </Row>
          </Card.Content>
        </Card>
        <IconButton
          icon={'filter-menu-outline'}
          iconColor={
            typeFilter != 'all' ? Colors.COLOR_PRIMARY : Colors.COLOR_GRAY
          }
          size={20}
          onPress={() => setShowTypeModal(true)}
        />
        <MButton
          disabled={queryDate == 'ALL' && typeFilter == 'all'}
          onPress={() => {
            setQueryDate('ALL');
            setTypeFilter('all');
          }}>
          Hapus Filter
        </MButton>
      </Row>
      <Gap h={14} />
      <Searchbar
        placeholder="Cari no. dokumen, jenis, coa..."
        value={search}
        onChangeText={text => setSearch(text)}
        onBlur={() => getList()}
        onClearIconPress={() => getList(true)}
      />
      {list?.length ? (
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => {
            return (
              <CustomCard.PengajuanCard
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
      ) : (
        <BlankScreen>Belum ada pengajuan!</BlankScreen>
      )}
      <ModalView
        type={'dateyear'}
        visible={showDateSelector}
        dateCallback={onSelectedDate}
      />
      <ModalView
        tabState={'WAITING'}
        type={'typefilter'}
        visible={showTypeModal}
        onClose={setShowTypeModal}
        state={typeFilter}
        typeCallback={cb => setTypeFilter(cb)}
      />
    </View>
  );
};

// Render List Disetujui
const RenderDisetujui = () => {
  const [list, setList] = React.useState();
  const [showDateSelector, setShowDateSelector] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('ALL');
  const [queryDate, setQueryDate] = React.useState('ALL');
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [showTypeModal, setShowTypeModal] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const navigation = useNavigation();

  function onSelectedDate({state, value}) {
    setShowDateSelector(false);
    if (state !== 'CANCEL') {
      setSelectedDate(getMonthYear(value));
      setQueryDate(getMonthYearNumber(value));
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      getList();
    }, [queryDate, typeFilter, statusFilter]),
  );

  async function getList(clear) {
    const data = await getHistory(
      '01',
      queryDate,
      search,
      clear,
      typeFilter,
      statusFilter,
    );
    if (data !== 'ERROR') {
      setList(data);
      setRefreshing(false);
    } else {
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setQueryDate('ALL');
    getList();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Row>
        <Card
          style={styles.dateContainer}
          mode={'contained'}
          onPress={() => setShowDateSelector(true)}>
          <Card.Content>
            <Row>
              <Text variant="labelMedium" style={styles.textDate}>
                {queryDate == 'ALL' ? 'Semua' : selectedDate}
              </Text>
              <Icon
                source={'arrow-down-drop-circle'}
                size={18}
                color={Colors.COLOR_DARK_GRAY}
              />
            </Row>
          </Card.Content>
        </Card>
        <IconButton
          icon={'filter-menu-outline'}
          iconColor={
            typeFilter != 'all' || statusFilter != 'all'
              ? Colors.COLOR_PRIMARY
              : Colors.COLOR_GRAY
          }
          size={20}
          onPress={() => setShowTypeModal(true)}
        />
        <MButton
          disabled={
            queryDate == 'ALL' && typeFilter == 'all' && statusFilter == 'all'
          }
          onPress={() => {
            setQueryDate('ALL');
            setTypeFilter('all');
            setStatusFilter('all');
          }}>
          Hapus Filter
        </MButton>
      </Row>
      <Gap h={14} />
      <Searchbar
        placeholder="Cari no. dokumen, jenis, coa..."
        value={search}
        onChangeText={text => setSearch(text)}
        onBlur={() => getList()}
        onClearIconPress={() => getList(true)}
      />
      {list?.length ? (
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => {
            return (
              <CustomCard.PengajuanCard
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
      ) : (
        <BlankScreen>Belum ada pengajuan!</BlankScreen>
      )}
      <ModalView
        type={'dateyear'}
        visible={showDateSelector}
        dateCallback={onSelectedDate}
      />
      <ModalView
        tabState={'DONE'}
        type={'typefilter'}
        visible={showTypeModal}
        onClose={setShowTypeModal}
        state={typeFilter}
        status={statusFilter}
        typeCallback={cb => setTypeFilter(cb)}
        statusCallback={cb => setStatusFilter(cb)}
      />
    </View>
  );
};

const HistoryScreen = () => {
  // define tab
  const Tab = createMaterialTopTabNavigator();

  function renderTab() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors.COLOR_SECONDARY,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
          },
          tabBarActiveTintColor: Colors.COLOR_WHITE,
          tabBarInactiveTintColor: Colors.COLOR_DARK_GRAY,
          tabBarIndicatorStyle: {
            backgroundColor: Colors.COLOR_PRIMARY,
            height: 6,
          },
        }}>
        <Tab.Screen
          name="Diajukan"
          component={RenderDiajukan}
          options={{
            title: 'Dalam Proses',
          }}
        />
        <Tab.Screen
          name="Disetujui"
          component={RenderDisetujui}
          options={{
            title: 'Selesai',
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <Header title={'Riwayat Pengajuan'} />
      {renderTab()}
    </Container>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: Size.SIZE_14,
    backgroundColor: Colors.COLOR_WHITE,
  },

  dateContainer: {
    flex: 1,
    marginRight: Size.SIZE_14,
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
