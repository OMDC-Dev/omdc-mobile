import {Alert, Platform, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Button, Dropdown, Gap, Header, InputLabel} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Snackbar, TextInput} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {DEPT, USER_COMPLETE} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {AuthContext} from '../../context';

const UserCompleteScreen = () => {
  const {signIn, user} = React.useContext(AuthContext);

  const navigation = useNavigation();

  const route = useRoute();

  const IS_FROM_EDIT = route.name == 'UpdateUser';

  const {userToken} = IS_FROM_EDIT ? user : route?.params?.user;
  const USER = IS_FROM_EDIT ? user : route.params.user;

  // === STATE
  const [nomorWA, setNomorWA] = React.useState(
    user?.nomorWA || user?.nomorwa || '',
  );
  const [dept, setDept] = React.useState(user?.departemen || '');
  const [isLoading, setIsLoading] = React.useState(false);

  // snackbar
  const [snack, setSnack] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState();

  async function completeProfile() {
    setIsLoading(true);
    // body
    const body = {
      nomorwa: nomorWA,
      departemen: dept,
    };

    const {state, data, error} = await fetchApi({
      url: USER_COMPLETE + `/${USER.iduser}`,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      signIn({
        ...USER,
        nomorWA: nomorWA,
        departemen: dept,
        userToken: data.userToken,
      });
      if (IS_FROM_EDIT) {
        Alert.alert('Sukses', 'Data anda telah diupdate!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } else {
      setIsLoading(false);
      setSnackMsg(error);
      setSnack(true);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <Header title={IS_FROM_EDIT ? 'Update Profile' : 'Lengkapi Profile'} />
      <View style={styles.mainContainer}>
        <InputLabel>Nomor Whatsapp</InputLabel>
        <TextInput
          editable={!isLoading}
          style={styles.input}
          mode={'outlined'}
          keyboardType={'phone-pad'}
          returnKeyType={'done'}
          placeholder={'Nomor Whatsapp'}
          placeholderTextColor={Colors.COLOR_DARK_GRAY}
          onChangeText={text => setNomorWA(text)}
          value={nomorWA}
        />

        <Gap h={6} />
        <InputLabel>Pilih Departemen</InputLabel>
        <Dropdown.DeptDropdown
          disabled={isLoading}
          defaultValue={dept}
          onChange={val => setDept(val)}
        />
        <View style={styles.bottom}>
          <Button
            loading={isLoading}
            onPress={() => completeProfile()}
            disabled={!nomorWA || !dept}>
            Lanjut
          </Button>
        </View>
      </View>
      <Snackbar visible={snack} onDismiss={() => setSnack(false)}>
        {snackMsg || ''}
      </Snackbar>
    </View>
  );
};

export default UserCompleteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingTop: Platform.OS == 'android' ? 0 : Scaler.scaleSize(38),
  },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Size.SIZE_14,
  },

  input: {
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },
});
