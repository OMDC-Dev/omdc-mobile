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
import {Colors, Scaler, Size} from '../../styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  BlankScreen,
  Button,
  Row,
  Card as CustomCard,
  Gap,
} from '../../components';
import ModalView from '../../components/modal';
import {getMonthYear, getMonthYearNumber} from '../../utils/utils';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {PENGAJUAN, REIMBURSEMENT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {AuthContext} from '../../context';

async function getHistory(type = '00', monthyear, search, clear) {
  let useMonthFilter = '';

  if (monthyear !== 'ALL') {
    useMonthFilter = `&monthyear=${monthyear}`;
  }

  const query = `?status=${type}&page=1&limit=200${useMonthFilter}&cari=${
    clear ? '' : search
  }`;
  const {state, data, error} = await fetchApi({
    url: PENGAJUAN + query,
    method: 'GET',
  });

  if (state == API_STATES.OK) {
    return data?.rows;
  } else {
    return 'ERROR';
  }
}

// Render List Diajukan
const RenderWaiting = () => {
  const [list, setList] = React.useState();
  const [showDateSelector, setShowDateSelector] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('ALL');
  const [queryDate, setQueryDate] = React.useState('ALL');
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const navigation = useNavigation();
  const {user} = React.useContext(AuthContext);

  const IS_ADMIN = user?.isAdmin;

  function onSelectedDate({state, value}) {
    setShowDateSelector(false);
    if (state !== 'CANCEL') {
      setSelectedDate(getMonthYear(value));
      setQueryDate(getMonthYearNumber(value));
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getList();
      setSearch('');
    }, [queryDate]),
  );

  async function getList(clear) {
    const data = await getHistory('00', queryDate, search, clear);
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
        <MButton
          disabled={queryDate == 'ALL'}
          onPress={() => setQueryDate('ALL')}>
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
          contentContainerStyle={{paddingBottom: Scaler.scaleSize(90)}}
          renderItem={({item, index}) => {
            return (
              <CustomCard.PengajuanCard
                data={item}
                onPress={() =>
                  navigation.navigate('PengajuanStack', {
                    screen: 'PengajuanDetail',
                    params: {
                      data: {...item, isAdmin: IS_ADMIN},
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
    </View>
  );
};

// Render List Disetujui
const RenderDone = () => {
  const [list, setList] = React.useState();
  const [showDateSelector, setShowDateSelector] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('ALL');
  const [queryDate, setQueryDate] = React.useState('ALL');
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');

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
      getList();
      setSearch('');
    }, [queryDate]),
  );

  async function getList(clear) {
    const data = await getHistory('01', queryDate, search, clear);
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
        <MButton
          disabled={queryDate == 'ALL'}
          onPress={() => setQueryDate('ALL')}>
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
          contentContainerStyle={{paddingBottom: Scaler.scaleSize(90)}}
          renderItem={({item, index}) => {
            return (
              <CustomCard.PengajuanCard
                data={item}
                onPress={() =>
                  navigation.navigate('PengajuanStack', {
                    screen: 'PengajuanDetail',
                    params: {
                      data: item,
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
    </View>
  );
};

const DiajukanScreen = () => {
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
          name="Waiting"
          component={RenderWaiting}
          options={{
            title: 'Menunggu Persetujuan',
          }}
        />
        <Tab.Screen
          name="Done"
          component={RenderDone}
          options={{
            title: 'Selesai',
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <View style={styles.header}>
        <Text variant={'titleMedium'} style={styles.textTitle}>
          Pengajuan User
        </Text>
      </View>
      {renderTab()}
    </SafeAreaView>
  );
};

export default DiajukanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
  },

  mainContainer: {
    flex: 1,
    padding: Size.SIZE_14,
    backgroundColor: Colors.COLOR_WHITE,
  },

  header: {
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingHorizontal: Size.SIZE_14,
    paddingVertical: Size.SIZE_20,
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
