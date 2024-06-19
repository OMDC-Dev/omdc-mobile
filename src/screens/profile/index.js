import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {Avatar, Card, Icon, Snackbar, Text} from 'react-native-paper';
import {Container, Gap, Header, Row} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {AuthContext} from '../../context';
import {useNavigation} from '@react-navigation/native';
import packageInfo from '../../../package.json';
import {fetchApi} from '../../api/api';
import {LOGOUT} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {user, signOut} = React.useContext(AuthContext);

  const [showSnack, setShowSnack] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const PROFILE_MENU = [
    {
      id: 'button',
      icon: 'archive-plus-outline',
      title: 'Master Barang',
      navTo: () =>
        navigation.navigate('MasterBarang', {
          screen: 'BarangCari',
          params: {
            fromMaster: true,
          },
        }),
      style: styles.textIconButton,
    },
    {
      id: 'button',
      icon: 'account-lock-open-outline',
      title: 'Ubah Password',
      navTo: () => navigation.navigate('UpdatePassword'),
      style: styles.textIconButton,
    },
    {
      id: 'button',
      icon: 'account-edit-outline',
      title: 'Update Profile',
      navTo: () => navigation.navigate('UpdateUser'),
      style: styles.textIconButton,
    },
    {
      id: 'exit',
      icon: 'exit-to-app',
      title: 'Keluar',
      navTo: () => onLogout(),
      style: styles.textIconButtonExit,
    },
  ];

  console.log(user);

  async function onLogout() {
    setIsLoading(true);
    const {state, data, error} = await fetchApi({url: LOGOUT, method: 'POST'});
    if (state == API_STATES.OK) {
      setIsLoading(false);
      signOut();
    } else {
      setIsLoading(false);
      setSnackMessage('Ada sesuatu yang tidak beres, mohon coba lagi!');
      setShowSnack(true);
    }
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <Header hideBack={true} title={'Profile'} />
      <View style={styles.headerTop}>
        <Avatar.Icon icon={'account'} size={56} />
        <Gap h={8} />
        <Text variant={'labelMedium'} style={styles.textTitle}>
          {user?.nm_user}
        </Text>
        <Gap h={4} />
        <Text variant={'labelSmall'} style={styles.textDepart}>
          {user?.level_user}
        </Text>
      </View>
      <Gap h={8} />
      <View style={styles.mainContainer}>
        {PROFILE_MENU.map((item, index) => {
          return (
            <View key={item + index}>
              <Card mode={'outlined'} disabled={isLoading} onPress={item.navTo}>
                <Card.Content>
                  <Row>
                    <Icon
                      source={item.icon}
                      size={24}
                      color={
                        item.id == 'exit'
                          ? Colors.COLOR_RED
                          : Colors.COLOR_DARK_GRAY
                      }
                    />
                    <Gap w={14} />
                    <Text variant={'labelMedium'} style={item.style}>
                      {item.title}
                    </Text>
                    <Icon
                      source={'arrow-right-circle-outline'}
                      size={24}
                      color={Colors.COLOR_DARK_GRAY}
                    />
                  </Row>
                </Card.Content>
              </Card>
              <Gap h={14} />
            </View>
          );
        })}

        <Text style={styles.textVersion} variant="labelSmall">
          Version v.{packageInfo.version}
        </Text>
      </View>
      <Snackbar visible={showSnack} onDismiss={() => setShowSnack(false)}>
        {snackMessage}
      </Snackbar>
    </Container>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  headerTop: {
    alignItems: 'center',
    padding: Size.SIZE_14,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  exitButton: {
    borderColor: Colors.COLOR_RED,
  },

  // text
  textTitle: {
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
  },

  textDepart: {
    color: Colors.COLOR_WHITE,
  },

  textIconButton: {
    flex: 1,
    color: Colors.COLOR_DARK_GRAY,
  },

  textIconButtonExit: {
    flex: 1,
    color: Colors.COLOR_RED,
  },

  textVersion: {
    marginTop: Scaler.scaleSize(24),
    textAlign: 'center',
    color: Colors.COLOR_PRIMARY,
  },
});
