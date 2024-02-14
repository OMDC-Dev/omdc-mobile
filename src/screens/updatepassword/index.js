import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Button, Gap, Header, InputLabel} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {state} from '../../utils/hooks';
import {Snackbar, TextInput} from 'react-native-paper';
import ModalView from '../../components/modal';
import {fetchApi} from '../../api/api';
import {UPDATE_PASSWORD} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const UpdatePasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // state
  const [snak, setSnak] = state();
  const [snakMsg, setSnakMsg] = state();

  // loading
  const [loading, setLoading] = state();

  // last pw
  const [lastPw, setLastPw] = state();
  const [showLastPw, setShowLastPw] = state(false);

  // new pw
  const [newPw, setNewPw] = state();
  const [showNewPw, setShowNewPw] = state(false);

  // confirm pw
  const [confirmPw, setConfirmPw] = state();
  const [showConfirmPw, setShowConfirmPw] = state(false);

  // modal
  const [modalType, setModalType] = React.useState('loading');
  const [modalMesage, setModalMessage] = React.useState('');

  async function onConfirmPressed() {
    setModalType('loading');
    setLoading(true);
    if (newPw !== confirmPw) {
      setSnakMsg('Password baru tidak sesuai!');
      setSnak(true);
      setLoading(false);
      return;
    }

    const body = {
      lastPassword: lastPw,
      newPassword: newPw,
    };

    const {state, data, error} = await fetchApi({
      url: UPDATE_PASSWORD,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setModalMessage('Password berhasil diubah!');
      setModalType('popup');
    } else {
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header title={'Update Pasword'} />
      <View style={styles.mainContainer}>
        <InputLabel>Password Lama</InputLabel>
        <TextInput
          editable={!loading}
          mode="outlined"
          value={lastPw}
          placeholder="Masukan Password Lama"
          secureTextEntry={!showLastPw}
          onChangeText={text => setLastPw(text)}
          left={<TextInput.Icon icon={'lock'} color={Colors.COLOR_DARK_GRAY} />}
          right={
            <TextInput.Icon
              icon={!showLastPw ? 'eye' : 'eye-off'}
              color={Colors.COLOR_DARK_GRAY}
              onPress={() => setShowLastPw(!showLastPw)}
            />
          }
        />
        <Gap h={14} />
        <InputLabel>Password Baru</InputLabel>
        <TextInput
          editable={!loading}
          mode="outlined"
          value={newPw}
          placeholder="Masukan Password Baru"
          secureTextEntry={!showNewPw}
          onChangeText={text => setNewPw(text)}
          left={<TextInput.Icon icon={'lock'} color={Colors.COLOR_DARK_GRAY} />}
          right={
            <TextInput.Icon
              icon={!showNewPw ? 'eye' : 'eye-off'}
              color={Colors.COLOR_DARK_GRAY}
              onPress={() => setShowNewPw(!showNewPw)}
            />
          }
        />
        <Gap h={14} />
        <InputLabel>Konfirmasi Password Baru</InputLabel>
        <TextInput
          editable={!loading}
          mode="outlined"
          value={confirmPw}
          placeholder="Konfirmasi Password Baru"
          secureTextEntry={!showConfirmPw}
          onChangeText={text => setConfirmPw(text)}
          left={<TextInput.Icon icon={'lock'} color={Colors.COLOR_DARK_GRAY} />}
          right={
            <TextInput.Icon
              icon={!showConfirmPw ? 'eye' : 'eye-off'}
              color={Colors.COLOR_DARK_GRAY}
              onPress={() => setShowConfirmPw(!showConfirmPw)}
            />
          }
        />
        <Gap h={14} />
        <View style={styles.bottomContainer}>
          <Button
            loading={loading}
            disabled={!lastPw || !newPw || !confirmPw || loading}
            onPress={() => onConfirmPressed()}>
            Ubah Password
          </Button>
        </View>
      </View>
      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
      <ModalView
        visible={loading}
        type={modalType}
        message={modalMesage}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default UpdatePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingTop: Platform.OS == 'ios' ? Scaler.scaleSize(38) : 0,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  input: {
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Size.SIZE_14,
  },
});
