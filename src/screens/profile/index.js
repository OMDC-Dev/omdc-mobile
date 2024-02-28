import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Avatar, Card, Icon, Text} from 'react-native-paper';
import {Container, Gap, Header, Row} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {AuthContext} from '../../context';
import {useNavigation} from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {user, signOut} = React.useContext(AuthContext);
  return (
    <Container>
      <Header hideBack={true} title={'Profile'} />
      <View style={styles.headerTop}>
        <Avatar.Icon icon={'account'} size={56} />
        <Gap h={8} />
        <Text variant={'labelMedium'} style={styles.textTitle}>
          {user?.nm_user}
        </Text>
        <Gap h={4} />
        <Text variant={'labelSmall'} style={styles.textDepart}>
          {user?.departemen}
        </Text>
      </View>
      <Gap h={8} />
      <View style={styles.mainContainer}>
        <Card
          mode={'outlined'}
          onPress={() => navigation.navigate('UpdatePassword')}>
          <Card.Content>
            <Row>
              <Icon
                source={'account-lock-open-outline'}
                size={24}
                color={Colors.COLOR_DARK_GRAY}
              />
              <Gap w={14} />
              <Text variant={'labelMedium'} style={styles.textIconButton}>
                Ubah Password
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
        <Card
          mode={'outlined'}
          onPress={() => navigation.navigate('UpdateUser')}>
          <Card.Content>
            <Row>
              <Icon
                source={'account-edit-outline'}
                size={24}
                color={Colors.COLOR_DARK_GRAY}
              />
              <Gap w={14} />
              <Text variant={'labelMedium'} style={styles.textIconButton}>
                Update Profile
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
        <Card
          mode={'outlined'}
          style={styles.exitButton}
          onPress={() => signOut()}>
          <Card.Content>
            <Row>
              <Icon source={'exit-to-app'} size={24} color={Colors.COLOR_RED} />
              <Gap w={14} />
              <Text variant={'labelMedium'} style={styles.textIconButtonExit}>
                Keluar
              </Text>
            </Row>
          </Card.Content>
        </Card>
        <Text style={styles.textVersion} variant="labelSmall">
          Version v.0.7.1
        </Text>
      </View>
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
