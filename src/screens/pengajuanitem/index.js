import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {
  Button,
  ErrorHelperText,
  Gap,
  Header,
  InputLabel,
  Row,
} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TextInput, Button as PButton} from 'react-native-paper';
import {formatRupiah} from '../../utils/rupiahFormatter';
import {fetchApi} from '../../api/api';
import {CEK_INVOICE} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';

const PengajuanItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const EXT_ITEM = route.params?.data;

  console.log('EXT', EXT_ITEM);

  const [inv, setInv] = React.useState();
  const [name, setName] = React.useState();
  const [nominal, setNominal] = React.useState();

  const [invAva, setInvAva] = React.useState(false);
  const [invLoading, setInvLoading] = React.useState(false);
  const [avaError, setAvaError] = React.useState();

  function onInputFocus() {
    if (!nominal) return;

    const backFormatted = nominal.replace(/\./g, '');
    setNominal(backFormatted);
  }

  function onInputBlur() {
    if (!nominal) return;

    const formatted = formatRupiah(nominal);
    setNominal(formatted);
  }

  async function onCekInvoice() {
    const extFind = EXT_ITEM.find(
      item => item.invoice.toLowerCase() == inv.toLowerCase(),
    );

    if (extFind) {
      setAvaError('No. Invoice telah digunakan.');
      setInvLoading(false);
      setInvAva(false);
      return;
    }

    setInvLoading(true);
    const {state, data, error} = await fetchApi({
      url: CEK_INVOICE(encodeURIComponent(inv)),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setInvLoading(false);
      setInvAva(true);
      setAvaError();
    } else {
      setAvaError(error);
      setInvLoading(false);
      setInvAva(false);
    }
  }

  return (
    <View style={styles.container}>
      <Header title={'Tambah Item'} />
      <View style={styles.mainContainer}>
        <InputLabel>No. Invoice / No. Bukti</InputLabel>
        <TextInput
          style={styles.input}
          mode={'outlined'}
          placeholder={'No. Invoice / No. Bukti'}
          placeholderTextColor={Colors.COLOR_DARK_GRAY}
          onChangeText={text => {
            setInv(text);
            setInvAva(false);
          }}
          value={inv}
          error={avaError}
        />
        <Gap h={14} />
        <PButton
          loading={invLoading}
          mode={'contained'}
          disabled={!inv || invLoading || invAva}
          onPress={() => onCekInvoice()}>
          {invAva ? 'Tersedia' : 'Cek Invoice'}
        </PButton>
        <ErrorHelperText error={avaError} />
        <Gap h={6} />

        <InputLabel>Nama Item</InputLabel>
        <TextInput
          style={styles.input}
          mode={'outlined'}
          placeholder={'Nama Item'}
          placeholderTextColor={Colors.COLOR_DARK_GRAY}
          onChangeText={text => setName(text)}
          value={name}
        />

        <Gap h={6} />
        <InputLabel>Nominal</InputLabel>
        <TextInput
          style={styles.input}
          mode={'outlined'}
          keyboardType={'phone-pad'}
          returnKeyType={'done'}
          placeholder={'Nominal'}
          // onBlur={onInputBlur}
          // onFocus={onInputFocus}
          placeholderTextColor={Colors.COLOR_DARK_GRAY}
          onChangeText={text => setNominal(text)}
          value={nominal}
          left={<TextInput.Icon icon={'cash'} color={Colors.COLOR_DARK_GRAY} />}
        />
        <Gap h={32} />
        <Button
          disabled={!name || !nominal || !inv || avaError || !invAva}
          onPress={() =>
            navigation.navigate('Pengajuan', {
              item: {name: name, nominal: nominal, invoice: inv},
            })
          }>
          Tambah Item
        </Button>
      </View>
    </View>
  );
};

export default PengajuanItemScreen;

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
});
