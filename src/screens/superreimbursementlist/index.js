import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Searchbar, Text} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {SUPERUSER_REIMBURSEMENT} from '../../api/apiRoutes';
import {BlankScreen, Card, Container, Gap, Header} from '../../components';
import {Colors, Size} from '../../styles';
import {API_STATES} from '../../utils/constant';
import {getLabelByValue} from '../../utils/utils';

const SuperReimbursementListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // state
  const [list, setList] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');

  // paging
  const [page, setPage] = React.useState(1);
  const [moreLoading, setMoreLoading] = React.useState(false);
  const [lastPage, setLastPage] = React.useState();

  const DATE_PERIOD = route.params?.date;
  const CABANG = route.params?.cabang;
  const BANK = getLabelByValue(route.params?.bank);
  const COA = route.params?.coa;

  let addParam = '';

  if (CABANG) {
    addParam += `&cabang=${CABANG}`;
  }

  if (BANK) {
    addParam += `&bank=${BANK}`;
  }

  if (COA) {
    addParam += `&coa=${COA}`;
  }

  // get all list
  // React.useEffect(() => {
  //   getAllList();
  // }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllList();
    });

    return unsubscribe;
  }, [navigation]);

  async function getAllList(clear) {
    console.log('CALLED : ' + keyword);
    setIsLoading(true);

    try {
      const {state, data, error} = await fetchApi({
        url:
          SUPERUSER_REIMBURSEMENT +
          `?startDate=${DATE_PERIOD.awal}&endDate=${DATE_PERIOD.akhir}&cari=${
            clear ? '' : keyword
          }` +
          addParam,
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        setIsLoading(false);
        setList(data.rows);
        setLastPage(data?.endPage);
      } else {
        setIsLoading(false);
        setList('ERROR');
      }
    } catch (error) {
      setIsLoading(false);
      setList('ERROR');
    }
  }

  async function loadMoreList() {
    if (!moreLoading && list.length >= 20) {
      setMoreLoading(true);
      try {
        const {state, data, error} = await fetchApi({
          url:
            SUPERUSER_REIMBURSEMENT +
            `&page=${page}&startDate=${DATE_PERIOD.awal}&endDate=${DATE_PERIOD.akhir}&cari=${keyword}` +
            addParam,
          method: 'GET',
        });

        if (state == API_STATES.OK) {
          setMoreLoading(false);
          setList(prev => [...prev, ...data.rows]);
        } else {
          setMoreLoading(false);
          setList(prev => [...prev]);
        }
      } catch (error) {
        setMoreLoading(false);
        setList(prev => [...prev]);
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
      <Header title={'Request of Payment'} />
      <View style={styles.mainContainer}>
        <Searchbar
          placeholder="Cari no. dokumen, jenis, coa..."
          value={keyword}
          onChangeText={text => setKeyword(text)}
          onBlur={() => getAllList()}
          onClearIconPress={() => getAllList(true)}
        />
        <Gap h={14} />
        {!isLoading || list !== 'ERROR' ? (
          list?.length ? (
            <FlatList
              data={list}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <Card.PengajuanCard
                  data={item}
                  onPress={() =>
                    navigation.navigate('PengajuanStack', {
                      screen: 'PengajuanDetail',
                      params: {
                        data: item,
                        type: 'REPORT',
                      },
                    })
                  }
                />
              )}
              onEndReachedThreshold={0.2}
              onEndReached={() => {
                if (page !== lastPage) {
                  setPage(page + 1);
                  loadMoreList();
                }
              }}
              ListFooterComponent={renderFooter}
            />
          ) : (
            <BlankScreen>Tidak ada data!</BlankScreen>
          )
        ) : (
          <BlankScreen loading={isLoading}>Error, mohon coba lagi!</BlankScreen>
        )}
      </View>
    </Container>
  );
};

export default SuperReimbursementListScreen;

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
