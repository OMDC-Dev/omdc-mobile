import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Container, Dropdown, Gap, Header, InputLabel} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {TextInput} from 'react-native-paper';

const MasterBarangAddScreen = () => {
  // dropdown state
  const [grup, setGrup] = React.useState();
  const [kategory, setKategory] = React.useState();
  const [suplier, setSuplier] = React.useState();
  const [kemasan, setKemasan] = React.useState();
  const [satuan, setSatuan] = React.useState();

  return (
    <Container>
      <StatusBar
        backgroundColor={Colors.COLOR_SECONDARY}
        barStyle={'light-content'}
      />
      <Header title={'Form Barang'} />
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            nestedScrollEnabled
            style={styles.mainContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: Scaler.scaleSize(60),
            }}>
            <InputLabel>Kode Barang</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
              placeholder={'Kode Barang'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
            />
            <Gap h={10} />
            <InputLabel>Barcode</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
              placeholder={'Barcode'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
            />
            <Gap h={10} />
            <InputLabel>Nama Barang</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'phone-pad'}
              returnKeyType={'done'}
              placeholder={'Nama Barang'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
            />
            <Gap h={10} />
            <InputLabel>Grup Barang</InputLabel>
            <Dropdown.GrupDropdown value={grup} setValue={setGrup} />
            <Gap h={10} />
            <InputLabel>Kategori Barang</InputLabel>
            <Dropdown.KategoryDropdown
              value={kategory}
              setValue={setKategory}
            />
            <Gap h={10} />
            <InputLabel>Suplier</InputLabel>
            <Dropdown.SuplierDropdownV2 value={suplier} setValue={setSuplier} />
            <Gap h={10} />
            <InputLabel>Kemasan</InputLabel>
            <Dropdown.KemasanBarangDropdown
              value={kemasan}
              setValue={setKemasan}
            />
            <Gap h={10} />
            <InputLabel>Isi Kemasan</InputLabel>
            <Dropdown.SatuanDropdown value={satuan} setValue={setSatuan} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
};

export default MasterBarangAddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  input: {
    backgroundColor: Colors.COLOR_WHITE,
    fontSize: Scaler.scaleFont(14),
  },
});
