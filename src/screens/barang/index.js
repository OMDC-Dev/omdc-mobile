import {FlatList, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Card, Container, Gap, Header} from '../../components';
import {Colors, Size} from '../../styles';
import {FAB, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {LIST_REQUEST_BARANG} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const BarangScreen = () => {
  const navigation = useNavigation();

  // state
  const [list, setList] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  // gte list
  React.useEffect(() => {
    getRequestedList();
  }, []);

  async function getRequestedList() {
    setIsLoading(true);
    const {state, data, error} = await fetchApi({
      url: LIST_REQUEST_BARANG,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setList(data);
    } else {
      setIsLoading(false);
      setList([]);
    }
  }

  return (
    <Container>
      <Header hideBack={true} title={'Permintaan Barang'} />
      <View style={styles.container}>
        <FlatList
          data={list}
          renderItem={({item, index}) => <Card.PermintaanCard data={item} />}
        />
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
