import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Icon, Snackbar, Text} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {GET_NOTIFICATION_COUNT} from '../../api/apiRoutes';
import {Gap, Row} from '../../components';
import {AuthContext} from '../../context';
import {Colors, Scaler, Size} from '../../styles';
import {API_STATES} from '../../utils/constant';
import {retrieveData} from '../../utils/store';
import {cekAkses} from '../../utils/utils';

const HomeScreen = () => {
  const [unreadCount, setUnreadCount] = React.useState();
  const [icon, setIcon] = React.useState();
  const [visible, setVisible] = React.useState(false);

  // navigation
  const navigation = useNavigation();
  const route = useRoute();

  // user context
  const {signOut, user} = React.useContext(AuthContext);
  const hasRequestBarang = cekAkses('#2', user.kodeAkses);
  const hasRR = cekAkses('#1', user.kodeAkses);
  const isAdminPB = cekAkses('#8', user.kodeAkses);
  const hasSuperReimbursement = cekAkses('#5', user.kodeAkses);
  const hasPBMaster = cekAkses('#10', user.kodeAkses);
  const isAdmin =
    user.type == 'ADMIN' ||
    user.type == 'FINANCE' ||
    user.type == 'MAKER' ||
    user.type == 'REVIEWER';
  const hasWorkplan = cekAkses('#11', user.kodeAkses);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  const MENU_LIST = [
    {
      title: 'R.O.P',
      icon: 'account-cash',
      color: Colors.COLOR_PRIMARY,
      type: 'ROP',
    },
    {
      title: 'Approval R.O.P',
      icon: 'account-check',
      color: Colors.COLOR_PRIMARY,
      type: 'ROP_ACC',
    },
    {
      title: 'Report R.O.P',
      icon: 'clipboard-flow',
      color: Colors.COLOR_PRIMARY,
      type: 'ROP_REPORT',
    },
    {
      title: 'Permintaan Barang',
      icon: 'basket-unfill',
      color: Colors.COLOR_ACCENT,
      type: 'PB',
    },
    {
      title: 'Approval Permintaan Barang',
      icon: 'archive-check',
      color: Colors.COLOR_ACCENT,
      type: 'PB_ACC',
    },
    {
      title: 'Master Barang',
      icon: 'archive-edit',
      color: Colors.COLOR_ACCENT,
      type: 'PB_MASTER',
    },
    {
      title: 'Workplan Saya',
      icon: 'briefcase',
      color: Colors.COLOR_ACCENT_2,
      type: 'WP',
    },
    {
      title: 'Workplan CC',
      icon: 'briefcase-account',
      color: Colors.COLOR_ACCENT_2,
      type: 'WP_CC',
    },
    {
      title: 'Approval Workplan',
      icon: 'briefcase-check',
      color: Colors.COLOR_ACCENT_2,
      type: 'WP_ACC',
    },
  ];

  function checkAndGo(type) {
    let IS_ERROR;
    let PATH;
    let PARAM = {};

    function _getAdminPath() {
      let path = '';

      switch (user.type) {
        case 'ADMIN':
          path = 'AdminStack';
          break;
        case 'REVIEWER':
          path = 'ReviewerStack';
          break;
        case 'MAKER':
          path = 'MakerStack';
          break;
        case 'FINANCE':
          path = 'FinanceStack';
          break;
        default:
          path = '';
          break;
      }

      return path;
    }

    switch (type) {
      case 'ROP':
        IS_ERROR = !hasRR;
        PATH = 'PengajuanStack';
        break;
      case 'ROP_ACC':
        IS_ERROR = !isAdmin;
        PATH = _getAdminPath();
        break;
      case 'ROP_REPORT':
        IS_ERROR = !hasSuperReimbursement;
        PATH = 'SuperROPStack';
        break;
      case 'PB':
        IS_ERROR = !hasRequestBarang;
        PATH = 'BarangStack';
        break;
      case 'PB_ACC':
        IS_ERROR = !isAdminPB;
        PATH = 'AdminBarangStack';
        break;
      case 'PB_MASTER':
        IS_ERROR = !hasPBMaster;
        PATH = 'BarangStack';
        PARAM = {
          screen: 'BarangCari',
          params: {
            fromMaster: true,
          },
        };
        break;
      case 'WP':
        IS_ERROR = !hasWorkplan;
        PATH = 'WorkplanStack';
        break;
      default:
        break;
    }

    if (IS_ERROR) {
      return onToggleSnackBar();
    }

    if (PATH) {
      navigation.navigate(PATH, PARAM);
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
      getNotificationCount();
    }, []),
  );

  React.useEffect(() => {
    loadIcon();
  }, []);

  async function loadIcon() {
    const getIcon = await retrieveData('APP_ICON');
    setIcon(getIcon);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <View style={styles.main}>
        <View style={styles.topContent}>
          <Image
            source={{uri: `data:image/png;base64,${icon}`}}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <Gap h={24} />
          <Row>
            <Row style={styles.topInfoLeft}>
              <Avatar.Icon icon={'account'} size={40} />
              <Gap w={10} />
              <View>
                <Text style={styles.textName} variant="labelLarge">
                  {user?.nm_user}
                </Text>
                <Text style={styles.textLvl} variant="labelSmall">
                  {user?.level_user}
                </Text>
              </View>
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
        </View>
        <View style={styles.mainContent}>
          <Gap h={8} />
          <View style={styles.menuContainer}>
            {MENU_LIST.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  style={styles.menuButton}
                  onPress={() => checkAndGo(item.type)}>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item.color},
                    ]}>
                    <Icon
                      size={20}
                      color={Colors.COLOR_WHITE}
                      source={item.icon}
                    />
                  </View>
                  <Gap h={6} />
                  <Text
                    numberOfLines={2}
                    style={styles.textMenu}
                    variant={'labelSmall'}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
      <Snackbar
        style={{bottom: 54}}
        visible={visible}
        duration={3000}
        onDismiss={onDismissSnackBar}>
        Anda tidak memiliki akses ke menu ini.
      </Snackbar>
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
    backgroundColor: Colors.COLOR_LIGHT_GRAY,
  },

  topContent: {
    backgroundColor: Colors.COLOR_SECONDARY,
    padding: Size.SIZE_14,
  },

  mainContent: {
    flex: 1,
  },

  menuContainer: {
    backgroundColor: Colors.COLOR_WHITE,
    paddingVertical: Size.SIZE_10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },

  logo: {
    width: Scaler.scaleSize(54),
    height: Scaler.scaleSize(24),
  },

  topInfoLeft: {
    flex: 1,
  },

  iconContainer: {
    width: Scaler.scaleSize(36),
    height: Scaler.scaleSize(36),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButton: {
    width: '25%',
    alignItems: 'center',
    marginVertical: 4,
    justifyContent: 'flex-start', // Pastikan semua elemen mulai dari atas
    minHeight: 80, // Atur tinggi minimum agar rata
  },

  textMenu: {
    textAlign: 'center',
    flexShrink: 1, // Mencegah teks melar ke luar
    maxWidth: '90%', // Batasi lebar teks
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

  textName: {
    color: Colors.COLOR_WHITE,
  },

  textLvl: {
    color: Colors.COLOR_LIGHT_GRAY,
  },
});

export default HomeScreen;
