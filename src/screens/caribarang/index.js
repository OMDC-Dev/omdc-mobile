import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {BlankScreen, Card, Container, Gap, Header} from '../../components';
import {Colors, Size} from '../../styles';
import {ActivityIndicator, Searchbar, Text} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {fetchApi} from '../../api/api';
import {GET_BARANG} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {debounce} from '../../utils/utils';

const BarangCariScreen = () => {
  // state
  const [barangs, setBarangs] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState();

  // paging
  const [page, setPage] = React.useState(1);
  const [moreLoading, setMoreLoading] = React.useState(false);
  const [lastPage, setLastPage] = React.useState();

  // get all barang
  React.useEffect(() => {
    getAllBarang();
  }, []);

  async function getAllBarang(clear) {
    console.log('CALLED : ' + keyword);
    setIsLoading(true);
    try {
      const {state, data, error} = await fetchApi({
        url: GET_BARANG(clear ? '' : keyword),
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        setBarangs(data.data);
        setLastPage(data?.endPage);
      } else {
        setIsLoading(false);
        setBarangs('ERROR');
      }
    } catch (error) {
      setIsLoading(false);
      setBarangs('ERROR');
    }
  }

  async function loadMoreBarang() {
    if (!moreLoading && barangs.length >= 25) {
      setMoreLoading(true);
      try {
        const {state, data, error} = await fetchApi({
          url: GET_BARANG(keyword) + `&page=${page}`,
          method: 'GET',
        });

        if (state == API_STATES.OK) {
          setMoreLoading(false);
          setBarangs(prev => [...prev, ...data.data]);
        } else {
          setMoreLoading(false);
          setBarangs(prev => [...prev]);
        }
      } catch (error) {
        setMoreLoading(false);
        setBarangs(prev => [...prev]);
      }
    }
  }

  // ======= Render

  const renderFooter = () => {
    if (page == lastPage) {
      <View style={styles.footer}>
        <Gap h={24} />
        <Text>Tidak ada data lagi.</Text>
      </View>;
    }

    return (
      <>
        <Gap h={24} />
        {moreLoading && <ActivityIndicator />}
      </>
    );
  };

  return (
    <Container>
      <Header title={'Cari barang'} />
      <View style={styles.mainContainer}>
        <Searchbar
          placeholder="Cari barang..."
          value={keyword}
          onChangeText={text => setKeyword(text)}
          onBlur={() => getAllBarang()}
          onClearIconPress={() => getAllBarang(true)}
        />
        <Gap h={14} />
        {!isLoading || barangs !== 'ERROR' ? (
          <FlatList
            data={barangs}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => <Card.BarangCard data={item} />}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (page !== lastPage) {
                setPage(page + 1);
                loadMoreBarang();
              }
            }}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <BlankScreen loading={isLoading}>Error, mohon coba lagi!</BlankScreen>
        )}
      </View>
    </Container>
  );
};

export default BarangCariScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  footer: {
    alignItems: 'center',
  },
});
