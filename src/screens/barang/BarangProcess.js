import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {LIST_REQUEST_BARANG} from '../../api/apiRoutes';
import {BlankScreen, Card} from '../../components';
import {Colors, Size} from '../../styles';
import {API_STATES} from '../../utils/constant';

const BarangProcess = () => {
  const navigation = useNavigation();

  // state
  const [list, setList] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  // gte list
  useFocusEffect(
    React.useCallback(() => {
      getRequestedList();
    }, []),
  );

  async function getRequestedList() {
    setIsLoading(true);
    let params = '?status=WAITING';
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
      {list?.length && !isLoading ? (
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
              onPress={() => navigation.navigate('BarangDetail', {data: item})}
            />
          )}
        />
      ) : (
        <BlankScreen loading={isLoading}>Belum ada data</BlankScreen>
      )}

      <FAB
        mode={'flat'}
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('BarangRequest')}
      />
    </View>
  );
};

export default BarangProcess;

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
