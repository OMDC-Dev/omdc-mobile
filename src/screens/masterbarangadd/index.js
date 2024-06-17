import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {Container, Dropdown, Gap, Header, InputLabel} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {TextInput, Text} from 'react-native-paper';
import {formatRupiah} from '../../utils/rupiahFormatter';

const MasterBarangAddScreen = () => {
  // dropdown state
  const [grup, setGrup] = React.useState();
  const [kategory, setKategory] = React.useState();
  const [suplier, setSuplier] = React.useState();
  const [kemasan, setKemasan] = React.useState();
  const [satuan, setSatuan] = React.useState();

  // input state
  const [kodeBarang, setKodeBarang] = React.useState();
  const [barcodeBarang, setBarcodeBarang] = React.useState();
  const [namaBarang, setNamaBarang] = React.useState();
  const [qtyIsiKemasan, setQtyIsiKemasan] = React.useState();
  const [hargaSatuan, setHargaSatuan] = React.useState();
  const [hargaKemasan, setHargaKemasan] = React.useState();
  const [hppSatuan, setHppSatuan] = React.useState();
  const [hppKemasan, setHPPKemasan] = React.useState();
  const [hargaJualSatuan, setHargaJualSatuan] = React.useState();
  const [hargaJualKemasan, setHargaJualKemasan] = React.useState();

  // [Calculate Pruice] ====
  // Harga Barang
  React.useEffect(() => {
    if (hargaSatuan && qtyIsiKemasan) {
      const calc = Number(hargaSatuan) * Number(qtyIsiKemasan);
      setHargaKemasan(calc);
    }
  }, [hargaSatuan, qtyIsiKemasan]);

  // HPP Barang
  React.useEffect(() => {
    if (hppSatuan && qtyIsiKemasan) {
      const calc = Number(hppSatuan) * Number(qtyIsiKemasan);
      setHPPKemasan(calc);
    }
  }, [hppSatuan, qtyIsiKemasan]);

  // Harga Jual Barang
  React.useEffect(() => {
    if (hargaJualSatuan && qtyIsiKemasan) {
      const calc = Number(hargaJualSatuan) * Number(qtyIsiKemasan);
      setHargaJualKemasan(calc);
    }
  }, [hargaJualSatuan, qtyIsiKemasan]);
  // =======================

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
              paddingBottom: Scaler.scaleSize(132),
            }}>
            <Text style={styles.subtitle} variant="titleSmall">
              Data Umum Barang
            </Text>
            <Gap h={10} />
            <InputLabel>Kode Barang</InputLabel>
            <TextInput
              style={styles.input}
              disabled
              mode={'outlined'}
              placeholder={'Kode Barang'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={kodeBarang}
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
              value={barcodeBarang}
              onChangeText={tx => setBarcodeBarang(tx)}
            />
            <Gap h={10} />
            <InputLabel>Nama Barang</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'default'}
              returnKeyType={'done'}
              placeholder={'Nama Barang'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={namaBarang}
              onChangeText={tx => setNamaBarang(tx)}
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
            <Gap h={10} />
            <InputLabel>Qty Isi Kemasan</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              placeholder={'Qty isi kemasan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              defaultValue="0"
              value={qtyIsiKemasan}
              onChangeText={tx => setQtyIsiKemasan(tx)}
            />
            <Gap h={24} />
            <Text style={styles.subtitle} variant="titleSmall">
              Harga Barang
            </Text>
            <Gap h={10} />
            <InputLabel>Harga Satuan</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              placeholder={'Harga satuan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={hargaSatuan}
              onChangeText={tx => setHargaSatuan(tx)}
            />
            <Gap h={10} />
            <InputLabel>Harga Kemasan</InputLabel>
            <TextInput
              style={styles.input}
              disabled
              mode={'outlined'}
              placeholder={'Harga kemasan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              defaultValue={formatRupiah(hargaKemasan, true)}
              value={hargaKemasan}
            />
            <Gap h={24} />
            <Text style={styles.subtitle} variant="titleSmall">
              HPP Barang
            </Text>
            <Gap h={10} />
            <InputLabel>HPP Satuan</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              placeholder={'Harga satuan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={hppSatuan}
              onChangeText={tx => setHppSatuan(tx)}
            />
            <Gap h={10} />
            <InputLabel>HPP Kemasan</InputLabel>
            <TextInput
              style={styles.input}
              disabled
              mode={'outlined'}
              placeholder={'HPP kemasan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              defaultValue={formatRupiah(hppKemasan, true)}
              value={hppKemasan}
            />
            <Gap h={24} />
            <Text style={styles.subtitle} variant="titleSmall">
              Harga Jual Barang
            </Text>
            <Gap h={10} />
            <InputLabel>Harga Jual Satuan</InputLabel>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              placeholder={'Harga jual satuan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={hargaJualSatuan}
              onChangeText={tx => setHargaJualSatuan(tx)}
            />
            <Gap h={10} />
            <InputLabel>Harga jual Kemasan</InputLabel>
            <TextInput
              style={styles.input}
              disabled
              mode={'outlined'}
              placeholder={'Harga jual kemasan'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              defaultValue={formatRupiah(hargaJualKemasan, true)}
              value={hargaJualKemasan}
            />
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

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
