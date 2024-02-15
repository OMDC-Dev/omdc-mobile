import * as React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Text, Button as PaperButton, Icon} from 'react-native-paper';
import {Colors, Scaler, Size} from '../../styles';
import {BlankScreen, Button, Card, Gap, Row} from '../../components';
import ASSETS from '../../utils/assetLoader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context';
import {GET_NOTIFICATION_COUNT, REIMBURSEMENT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {fetchApi} from '../../api/api';
import {cekAkses} from '../../utils/utils';

const HomeScreen = () => {
  const [recent, setRecent] = React.useState();
  const [unreadCount, setUnreadCount] = React.useState();

  // navigation
  const navigation = useNavigation();

  // user context
  const {signOut, user} = React.useContext(AuthContext);

  const hasReimbursement = cekAkses('#1', user?.kodeAkses);

  async function getRecentRequest() {
    const {state, data, error} = await fetchApi({
      url: REIMBURSEMENT + '?page=1&limit=5',
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setRecent(data);
    } else {
      console.log(error);
    }
  }

  async function getNotificationCount() {
    const {state, data, error} = await fetchApi({
      url: GET_NOTIFICATION_COUNT,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setUnreadCount(data.unreadCount);
    } else {
      setUnreadCount(0);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getRecentRequest();
      getNotificationCount();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <View style={styles.main}>
        <View style={styles.topContent}>
          <Image
            source={ASSETS.logo}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <Gap h={24} />
          <Row>
            <Row style={styles.topInfoLeft}>
              <Avatar.Icon icon={'account'} size={40} />
              <Gap w={10} />
              <Text style={styles.textName} variant="labelLarge">
                {user?.nm_user}
              </Text>
            </Row>
            <TouchableOpacity
              style={styles.bellButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('NotifikasiStack')}>
              {unreadCount && unreadCount > 0 ? (
                <View style={styles.bellBadge} />
              ) : null}
              <Icon
                source={'bell-outline'}
                size={22}
                color={Colors.COLOR_WHITE}
              />
            </TouchableOpacity>
          </Row>

          {hasReimbursement && (
            <>
              <Gap h={24} />
              <Button
                style={styles.buttonRequest}
                onPress={() => navigation.navigate('PengajuanStack')}>
                Ajukan Reimbursement
              </Button>
            </>
          )}
        </View>
        <View style={styles.mainContent}>
          <Row style={styles.rowSub}>
            <Text style={styles.textSubtitleLeft} variant="labelMedium">
              Pengajuan Terbaru
            </Text>
            <Text
              onPress={() => navigation.navigate('HistoryReimbursementStack')}
              style={styles.textSubtitle}
              variant="labelMedium">
              Riwayat Pengajuan
            </Text>
          </Row>
          {recent?.length ? (
            <FlatList
              data={recent}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => {
                return (
                  <Card.PengajuanCard
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
            <BlankScreen>Anda tidak memiliki pengajuan terbaru</BlankScreen>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
  },

  main: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
  },

  topContent: {
    backgroundColor: Colors.COLOR_SECONDARY,
    padding: Size.SIZE_14,
  },

  mainContent: {
    flex: 1,
    padding: Size.SIZE_14,
  },

  logo: {
    width: Scaler.scaleSize(60),
    height: Scaler.scaleSize(24),
  },

  buttonRequest: {
    borderRadius: 8,
  },

  topInfoLeft: {
    flex: 1,
  },

  rowSub: {
    marginVertical: Size.SIZE_10,
  },

  bellButton: {
    padding: Size.SIZE_8,
    borderRadius: 16,
  },

  bellBadge: {
    width: Size.SIZE_12,
    height: Size.SIZE_12,
    borderRadius: 6,
    right: 5,
    top: 5,
    backgroundColor: 'red',
    position: 'absolute',
  },

  // text
  textName: {
    color: Colors.COLOR_WHITE,
  },

  textSubtitle: {
    color: Colors.COLOR_PRIMARY,
  },

  textSubtitleLeft: {
    flex: 1,
    color: Colors.COLOR_DARK_GRAY,
  },

  textLogout: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
