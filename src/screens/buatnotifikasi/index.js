import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Gap, Header, InputLabel} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Button, Snackbar, TextInput} from 'react-native-paper';
import ModalView from '../../components/modal';
import {fetchApi} from '../../api/api';
import {GET_NOTIFICATION} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const BuatNotifikasiScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // state
  const [title, setTitle] = React.useState();
  const [message, setMessage] = React.useState();

  // modal
  const [loading, setLoading] = React.useState(false);
  const [modalType, setModalType] = React.useState('loading');
  const [modalMsg, setModalMsg] = React.useState();

  // snak
  const [snak, setSnak] = React.useState(false);
  const [snakMsg, setSnakMsg] = React.useState();

  async function onCreateNotif() {
    setModalType('loading');
    setLoading(true);
    const body = {
      title: title,
      message: message,
    };
    const {state, data, error} = await fetchApi({
      url: GET_NOTIFICATION,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setModalMsg('Sukses mengirim pengumuman ke seluruh user!');
      setModalType('popup');
    } else {
      setLoading(false);
      setSnakMsg('Ada kesalahan, mohon coba lagi!');
      setSnak(true);
    }
  }

  return (
    <View style={styles.container}>
      <Header title={'Buat Notifikasi'} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <InputLabel>Judul Pengumuman</InputLabel>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            placeholder={'Masukan Judul Pengumuman'}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setTitle(text)}
            value={title}
          />
          <Gap h={8} />
          <InputLabel>Pesan Pengumuman</InputLabel>
          <TextInput
            style={styles.inputArea}
            mode={'outlined'}
            multiline
            contentStyle={styles.inputContentArea}
            placeholder={'Masukan Pesan Pengumuman'}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setMessage(text)}
            value={message}
          />
          <View style={styles.bottomContainer}>
            <Button
              disabled={!title || !message}
              mode={'contained'}
              onPress={() => onCreateNotif()}>
              Rilis Pengumuman
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Snackbar visible={snak} onDismiss={() => setSnak(false)}>
        {snakMsg || ''}
      </Snackbar>
      <ModalView
        visible={loading}
        type={modalType}
        message={modalMsg}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default BuatNotifikasiScreen;

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

  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: Size.SIZE_14,
  },

  inputContentArea: {
    minHeight: Scaler.scaleSize(100),
    marginVertical: Platform.OS == 'android' ? Size.SIZE_18 : 0,
  },

  input: {
    height: Scaler.scaleSize(48),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },

  inputArea: {
    minHeight: Scaler.scaleSize(100),
    maxHeight: Scaler.scaleSize(200),
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },
});
