import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
  const [list, setList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');

  // paging
  const [page, setPage] = React.useState(1);
  const [moreLoading, setMoreLoading] = React.useState(false);
  const [listInfo, setListInfo] = React.useState(null);

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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setList([]);
  //     setPage(1);
  //     getAllList();
  //   }, []),
  // );

  React.useEffect(() => {
    getAllList();
  }, []);

  async function getAllList(clear = false, search = false) {
    if (clear) {
      setPage(1);
      setList([]);
    }

    if (search) {
      setPage(1);
      setList([]);
    }

    const currentPage = clear || search ? 1 : page;

    if (currentPage === 1) {
      setIsLoading(true);
    } else {
      setMoreLoading(true);
    }

    try {
      const {state, data, error} = await fetchApi({
        url:
          SUPERUSER_REIMBURSEMENT +
          `?startDate=${DATE_PERIOD.awal}&endDate=${DATE_PERIOD.akhir}&cari=${
            clear ? '' : keyword
          }&page=${currentPage}` +
          addParam,
        method: 'GET',
      });

      if (state === API_STATES.OK) {
        if (clear || search) {
          setList(data.rows);
        } else {
          setList(prevList => [...prevList, ...data.rows]);
        }
        setListInfo(data.pageInfo);
        setPage(currentPage + 1);
      } else {
        setList('ERROR');
      }
    } catch (error) {
      setList('ERROR');
    } finally {
      setIsLoading(false);
      setMoreLoading(false);
    }
  }

  const onLoadMore = () => {
    if (listInfo && page <= listInfo.pageCount && !moreLoading) {
      getAllList();
    }
  };

  const renderFooter = () => {
    return moreLoading ? (
      <View style={styles.footerLoading}>
        <Gap h={24} />
        <ActivityIndicator />
        <Gap h={14} />
        <Text variant={'bodySmall'}>Memuat lebih banyak...</Text>
      </View>
    ) : null;
  };

  return (
    <Container>
      <Header title={'Request of Payment'} />
      <View style={styles.mainContainer}>
        <Searchbar
          placeholder="Cari no. dokumen, jenis, coa..."
          value={keyword}
          onChangeText={text => setKeyword(text)}
          onBlur={() => getAllList(false, true)}
          onClearIconPress={() => {
            setKeyword('');
            getAllList(true);
          }}
        />
        <Gap h={14} />
        {isLoading && list === 'ERROR' ? (
          <BlankScreen loading={isLoading}>Error, mohon coba lagi!</BlankScreen>
        ) : list?.length ? (
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
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={onLoadMore}
            ListFooterComponent={renderFooter}
          />
        ) : (
          <BlankScreen>Tidak ada data!</BlankScreen>
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

  footerLoading: {
    alignItems: 'center',
  },
});
