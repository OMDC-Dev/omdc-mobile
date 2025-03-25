import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Card, Searchbar} from 'react-native-paper';
import {BlankScreen, Gap} from '../../../components';
import {RefreshControl} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Colors, Size} from '../../../styles';
import {fetchApi} from '../../../api/api';
import {WORKPLAN} from '../../../api/apiRoutes';
import {API_STATES} from '../../../utils/constant';

const ListPlaceholder = () => {
  const [list, setList] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      setSearch('');
      getList();
    }, []),
  );

  async function getList() {
    const {state, data, error} = await fetchApi({
      url: WORKPLAN + '?limit=100&page=1',
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data.rows);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getList();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Searchbar
        placeholder="Cari no. dokumen, jenis, coa..."
        value={search}
        onChangeText={text => setSearch(text)}
        onBlur={() => getList()}
        onClearIconPress={() => getList(true)}
      />
      <Gap h={14} />
      {list?.length ? (
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item, index}) => {
            return (
              <Card>
                <Card.Content>
                  <Text>Test</Text>
                </Card.Content>
              </Card>
            );
          }}
        />
      ) : (
        <BlankScreen>Belum ada pengajuan!</BlankScreen>
      )}
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
