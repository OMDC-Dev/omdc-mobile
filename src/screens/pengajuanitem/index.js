import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors, Scaler, Size} from '../../styles';
import {Button, Gap, Header, InputLabel} from '../../components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-paper';
import {formatRupiah} from '../../utils/rupiahFormatter';

const PengajuanItemScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = React.useState();
  const [nominal, setNominal] = React.useState();

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

  return (
    <View style={styles.container}>
      <Header title={'Tambah Item'} />
      <View style={styles.mainContainer}>
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
          onBlur={onInputBlur}
          onFocus={onInputFocus}
          placeholderTextColor={Colors.COLOR_DARK_GRAY}
          onChangeText={text => setNominal(text)}
          value={nominal}
          left={<TextInput.Icon icon={'cash'} color={Colors.COLOR_DARK_GRAY} />}
        />
        <Gap h={32} />
        <Button
          disabled={!name || !nominal}
          onPress={() =>
            navigation.navigate('Pengajuan', {
              item: {name: name, nominal: formatRupiah(nominal)},
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
