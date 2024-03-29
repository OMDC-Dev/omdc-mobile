import {FlatList, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {BlankScreen, Card, Container, Gap, Header} from '../../components';
import {Colors, Size} from '../../styles';
import {FAB, Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {LIST_REQUEST_BARANG} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const BarangScreen = () => {
  const navigation = useNavigation();

  // state
  const [list, setList] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  // gte list
  useFocusEffect(
    React.useCallback(() => {
      getRequestedList();
    }, []),
  );

  async function getRequestedList() {
    setIsLoading(true);
    const {state, data, error} = await fetchApi({
      url: LIST_REQUEST_BARANG,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setList(data?.rows);
    } else {
      setIsLoading(false);
      setList([]);
    }
  }

  return (
    <Container>
      <Header hideBack={true} title={'Permintaan Barang'} />
      <View style={styles.container}>
        {list && !isLoading ? (
          <FlatList
            data={list}
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
        ) : (
          <BlankScreen loading={isLoading}>
            Belum ada permintaan barang!
          </BlankScreen>
        )}

        <FAB
          mode={'flat'}
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('BarangRequest')}
        />
      </View>
    </Container>
  );
};

export default BarangScreen;

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
