import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {
  Button,
  Container,
  Dropdown,
  ErrorHelperText,
  Gap,
  Header,
  InputLabel,
  PickList,
  Row,
} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {TextInput, Text, Button as PButton} from 'react-native-paper';
import {formatRupiah} from '../../utils/rupiahFormatter';
import {generateRandomNumber} from '../../utils/utils';
import {MushForm} from '../../utils/MushForm';

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

  // checkbox
  const [checked, setChecked] = React.useState();

  // other
  const [inputError, setInputError] = React.useState({});

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

  // [Generate Random Numb] ====
  React.useEffect(() => {
    const numb = generateRandomNumber(100000, 999999);
    setKodeBarang(String(numb));
    setBarcodeBarang(String(numb));
  }, []);
  // ===========================

  // [On Add Barang] ====
  function onCheckInput() {
    const mush = [
      {
        id: 'barcode',
        value: barcodeBarang,
        label: 'Barcode',
        isRequired: true,
        type: 'input',
        minLength: 6,
      },
      {
        id: 'nama',
        value: namaBarang,
        label: 'Nama Barang',
        isRequired: true,
        type: 'input',
      },
      {
        id: 'grup',
        value: grup,
        label: 'Grup Barang',
        isRequired: true,
        type: 'dropdown',
      },
      {
        id: 'kategori',
        value: kategory,
        label: 'Kategori',
        isRequired: true,
        type: 'dropdown',
      },
      {
        id: 'kemasan',
        value: kemasan,
        label: 'Kemasan',
        isRequired: true,
        type: 'dropdown',
      },
      {
        id: 'isikemasan',
        value: satuan,
        label: 'Isi Kemasan',
        isRequired: true,
        type: 'dropdown',
      },
      {
        id: 'qty',
        value: qtyIsiKemasan,
        label: 'Qty Isi Kemasan',
        isRequired: true,
        type: 'number',
      },
      {
        id: 'hargasatuan',
        value: hargaSatuan,
        label: 'Harga Satuan',
        isRequired: true,
        type: 'number',
      },
      {
        id: 'hppsatuan',
        value: hppSatuan,
        label: 'HPP Satuan',
        isRequired: true,
        type: 'number',
      },
      {
        id: 'hargajualsatuan',
        value: hargaJualSatuan,
        label: 'Harga Jual Satuan',
        isRequired: true,
        type: 'number',
      },
    ];

    const {error, errorMessages} = MushForm(mush);

    if (error) {
      setInputError(errorMessages);
    } else {
      setInputError({});
    }
  }
  // ====================

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
              defaultValue={kodeBarang}
              value={kodeBarang}
              onChangeText={tx => setKodeBarang(tx)}
            />

            <Gap h={10} />
            <InputLabel>Barcode</InputLabel>
            <Row>
              <TextInput
                style={{...styles.input, flex: 1}}
                mode={'outlined'}
                keyboardType={'phone-pad'}
                returnKeyType={'done'}
                placeholder={'Barcode'}
                maxLength={6}
                placeholderTextColor={Colors.COLOR_DARK_GRAY}
                defaultValue={barcodeBarang}
                value={barcodeBarang}
                onChangeText={tx => setBarcodeBarang(tx)}
                error={inputError['barcode']}
              />
              <Gap w={14} />
              <PButton loading={true} onPress={() => console.log('OK')}>
                Cek Barcode
              </PButton>
            </Row>

            <ErrorHelperText error={inputError['barcode']} />

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
              error={inputError['nama']}
            />
            <ErrorHelperText error={inputError['nama']} />

            <Gap h={10} />
            <InputLabel>Grup Barang</InputLabel>
            <Dropdown.GrupDropdown value={grup} setValue={setGrup} />
            <ErrorHelperText error={inputError['grup']} />

            <Gap h={10} />
            <InputLabel>Kategori Barang</InputLabel>
            <Dropdown.KategoryDropdown
              value={kategory}
              setValue={setKategory}
            />
            <ErrorHelperText error={inputError['kategori']} />

            <Gap h={10} />
            <InputLabel>Suplier</InputLabel>
            <Dropdown.SuplierDropdownV2 value={suplier} setValue={setSuplier} />

            <Gap h={10} />
            <InputLabel>Kemasan</InputLabel>
            <Dropdown.KemasanBarangDropdown
              value={kemasan}
              setValue={setKemasan}
            />
            <ErrorHelperText error={inputError['kemasan']} />

            <Gap h={10} />
            <InputLabel>Isi Kemasan</InputLabel>
            <Dropdown.SatuanDropdown value={satuan} setValue={setSatuan} />
            <ErrorHelperText error={inputError['isikemasan']} />

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
            <ErrorHelperText error={inputError['qty']} />

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
            <ErrorHelperText error={inputError['hargasatuan']} />

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
            <ErrorHelperText error={inputError['hppsatuan']} />

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
            <ErrorHelperText error={inputError['hargajualsatuan']} />

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

            <Gap h={10} />
            <InputLabel>Status</InputLabel>
            <PickList checked={checked} setChecked={setChecked} />
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.bottomContainer}>
          <Button disabled={!checked} onPress={() => onCheckInput()}>
            Tambah Barang
          </Button>
        </View>
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

  bottomContainer: {
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_14,
  },

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
