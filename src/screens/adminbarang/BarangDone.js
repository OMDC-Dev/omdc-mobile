import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {fetchApi} from '../../api/api';
import {LIST_REQUEST_BARANG} from '../../api/apiRoutes';
import {BlankScreen, Card} from '../../components';
import {Colors, Size} from '../../styles';
import {API_STATES} from '../../utils/constant';
import {Searchbar} from 'react-native-paper';

const BarangDone = () => {
  const navigation = useNavigation();

  // state
  const [list, setList] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');

  // gte list
  useFocusEffect(
    React.useCallback(() => {
      getRequestedList();
    }, []),
  );

  async function getRequestedList(clear) {
    setIsLoading(true);
    let params = `?status=DONE&isAdmin=true&cari=${clear ? '' : search}`;
    const {state, data, error} = await fetchApi({
      url: LIST_REQUEST_BARANG + params,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setList(data?.rows);
      setRefreshing(false);
    } else {
      setIsLoading(false);
      setList([]);
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getRequestedList();
  }, []);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Cari ID PB, cabang, kode cabang ..."
        value={search}
        onChangeText={text => setSearch(text)}
        onBlur={() => getRequestedList()}
        onClearIconPress={() => {
          getRequestedList(true);
        }}
      />
      {list?.length && !isLoading ? (
        <>
          <FlatList
            data={list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 120}}
            renderItem={({item, index}) => (
              <Card.PermintaanCard
                data={item}
                onPress={() =>
                  navigation.navigate('BarangDetail', {data: item})
                }
              />
            )}
          />
        </>
      ) : (
        <BlankScreen loading={isLoading}>
          Belum ada permintaan barang!
        </BlankScreen>
      )}
    </View>
  );
};

export default BarangDone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS == 'ios' ? 80 : 52,
  },
});
