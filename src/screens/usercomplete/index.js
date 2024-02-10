import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Button, Dropdown, Gap, Header, InputLabel} from '../../components';
import {useRoute} from '@react-navigation/native';
import {Snackbar, TextInput} from 'react-native-paper';
import {fetchApi} from '../../api/api';
import {USER_COMPLETE} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {AuthContext} from '../../context';

const UserCompleteScreen = () => {
  const [nomorWA, setNomorWA] = React.useState();
  const [dept, setDept] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  // snackbar
  const [snack, setSnack] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState();

  const route = useRoute();

  const {userToken} = route?.params?.user;
  const USER = route.params.user;

  const {signIn} = React.useContext(AuthContext);

  async function completeProfile() {
    setIsLoading(true);
    // body
    const body = {
      nomorwa: nomorWA,
      departemen: dept,
    };

    // headers
    const headers = {
      Authorization: `Bearer ${userToken}`,
    };
    const {state, data, error} = await fetchApi({
      url: USER_COMPLETE,
      method: 'POST',
      data: body,
      headers,
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      signIn({...USER, nomorWA: nomorWA, departemen: dept});
    } else {
      setIsLoading(false);
      setSnackMsg(error);
      setSnack(true);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <Header title={'Lengkapi Profile'} />
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
        />

        <Gap h={6} />
        <InputLabel>Jenis Reimbursement</InputLabel>
        <Dropdown.DeptDropdown
          disabled={isLoading}
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
    paddingTop: Scaler.scaleSize(38),
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
