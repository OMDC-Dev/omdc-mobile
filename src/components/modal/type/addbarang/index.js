import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  Card,
  Text,
  TextInput,
  Button as PButton,
  IconButton,
  Icon,
} from 'react-native-paper';
import InputLabel from '../../../InputLabel';
import Row from '../../../Row';
import {Button, Dropdown, Gap} from '../../..';
import {Colors, Scaler, Size} from '../../../../styles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {AuthContext} from '../../../../context';
import {cekAkses} from '../../../../utils/utils';

// OPT
const pickOpts = {
  maxHeight: 1080,
  maxWidth: 1080,
  quality: 1,
  includeBase64: true,
  presentationStyle: 'fullScreen',
};

// IOS
async function pickFromGaleryIOS() {
  try {
    const result = await launchImageLibrary(pickOpts);

    if (!result.didCancel) {
      const dataResult = {
        base64: result.assets[0].base64,
        fileName: result.assets[0].fileName,
        fileType: result.assets[0].type,
        fileSize: result.assets[0].fileSize,
        from: 'GALLERY',
      };
      return dataResult;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// FROM CAMERA IOS
async function pickFromCameraIOS() {
  try {
    const result = await launchCamera(pickOpts);

    if (!result.didCancel) {
      const dataResult = {
        base64: result.assets[0].base64,
        fileName: result.assets[0].fileName,
        fileType: result.assets[0].type,
        fileSize: result.assets[0].fileSize,
        from: 'CAMERA',
      };
      return dataResult;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

const AddBarangModal = ({data, onAddPress}) => {
  // input state
  const [qtyStock, setQtyStock] = React.useState();
  const [qtyRequest, setQtyRequest] = React.useState();
  const [keterangan, setKeterangan] = React.useState();
  const [selectedImage, setSelectedImage] = React.useState();

  // user
  const {user} = React.useContext(AuthContext);

  // cek akses
  const needApprovalAdmin = cekAkses('#7', user.kodeAkses);

  // state from akses
  const isButtonDisabled = needApprovalAdmin ? !selectedImage : false;

  const CB_DATA = {
    stock: qtyStock,
    request: qtyRequest,
    keterangan: keterangan || '',
    attachment: selectedImage?.base64 ?? '',
  };

  // ======================== SELECT ATTACHMENT

  async function onPickFileCamera() {
    const pickResult = await pickFromCameraIOS();
    if (pickResult) {
      setSelectedImage(pickResult);
    }
  }

  async function onPickFileGallery() {
    const pickResult = await pickFromGaleryIOS();
    if (pickResult) {
      setSelectedImage(pickResult);
    }
  }

  function checkPermission(type = '') {
    if (type == 'GALLERY') {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async result => {
        if (result == 'granted') {
          // pickFromGaleryIOS(setSelected);
          //command('GALLERY');
          const pickResult = await pickFromGaleryIOS();
          if (pickResult) {
            setSelectedImage(pickResult);
          }
        } else {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async result => {
            if (result == 'granted') {
              //pickFromGaleryIOS(setSelected);
              //command('GALLERY');
              const pickResult = await pickFromGaleryIOS();
              if (pickResult) {
                setSelectedImage(pickResult);
              }
            } else {
              Alert.alert(
                'Aplikasi tidak diberikan izin',
                'Tidak memiliki izin untuk mengakses galeri, silahkan izinkan untuk dapat mengakses galeri',
                [
                  {
                    text: 'Minta Izin',
                    onPress: () => checkPermission('GALLERY'),
                  },
                  {
                    text: 'Batalkan',
                    style: 'cancel',
                  },
                ],
              );
            }
          });
        }
      });
    } else {
      check(PERMISSIONS.IOS.CAMERA).then(async result => {
        if (result == 'granted') {
          const pickResult = await pickFromCameraIOS();
          if (pickResult) {
            setSelectedImage(pickResult);
          }
        } else {
          request(PERMISSIONS.IOS.CAMERA).then(async result => {
            if (result == 'granted') {
              const pickResult = await pickFromCameraIOS();
              if (pickResult) {
                setSelectedImage(pickResult);
              }
            } else {
              Alert.alert(
                'Aplikasi tidak diberikan izin',
                'Tidak memiliki izin untuk mengakses galeri, silahkan izinkan untuk dapat mengakses galeri',
                [
                  {
                    text: 'Minta Izin',
                    onPress: () => checkPermission('CAMERA'),
                  },
                  {
                    text: 'Batalkan',
                    style: 'cancel',
                  },
                ],
              );
            }
          });
        }
      });
    }
  }

  // ======================== END SELECT ATTACHMENT

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title title={'Masukan Detail'} />

        <Card.Content>
          <InputLabel>Jumlah Stok</InputLabel>
          <Row>
            <TextInput
              placeholder="Jumlah Stok"
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              value={qtyStock}
              onChangeText={tx => setQtyStock(tx)}
            />
            <Text variant={'labelMedium'}>{data?.nm_kemasan}</Text>
            {/* <Dropdown.KemasanDropdown onChange={val => null} /> */}
          </Row>
          <Gap h={12} />
          <InputLabel>Jumlah Permintaan</InputLabel>
          <Row>
            <TextInput
              placeholder="Jumlah Permintaan"
              style={styles.input}
              mode={'outlined'}
              keyboardType={'decimal-pad'}
              returnKeyType={'done'}
              value={qtyRequest}
              onChangeText={tx => setQtyRequest(tx)}
            />
            <Text variant={'labelMedium'}>{data?.nm_kemasan}</Text>
            {/* <Dropdown.KemasanDropdown onChange={val => null} /> */}
          </Row>
          <Gap h={12} />
          <InputLabel>Keterangan</InputLabel>
          <TextInput
            placeholder="Keterangan"
            style={styles.inputNormal}
            mode={'outlined'}
            value={keterangan}
            onChangeText={tx => setKeterangan(tx)}
          />
          {needApprovalAdmin && (
            <>
              <Gap h={12} />
              <InputLabel>Lampiran</InputLabel>
              {selectedImage ? (
                <View>
                  <Image
                    source={{
                      uri: `data:image/png;base64,${selectedImage.base64}`,
                    }}
                    style={styles.imagePreview}
                    resizeMode={'contain'}
                  />
                  <Text
                    style={styles.deleteLampiran}
                    variant={'labelLarge'}
                    onPress={() => setSelectedImage(null)}>
                    Hapus
                  </Text>
                </View>
              ) : (
                <>
                  <Row>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <IconButton
                        icon={'camera-plus-outline'}
                        size={24}
                        iconColor={Colors.COLOR_DARK_GRAY}
                        onPress={() =>
                          Platform.OS == 'ios'
                            ? checkPermission('CAMERA')
                            : onPickFileCamera()
                        }
                      />
                      <Text variant={'labelSmall'}>Ambil dari Kamera</Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <IconButton
                        icon={'view-grid-plus-outline'}
                        size={24}
                        iconColor={Colors.COLOR_DARK_GRAY}
                        onPress={() =>
                          Platform.OS == 'ios'
                            ? checkPermission('GALLERY')
                            : onPickFileGallery()
                        }
                      />
                      <Text variant={'labelSmall'}>Tambah dari Galeri</Text>
                    </View>
                  </Row>
                </>
              )}
            </>
          )}

          <Gap h={32} />
          <Button
            disabled={
              !qtyRequest || !qtyStock || qtyRequest < 1 || isButtonDisabled
            }
            onPress={() => onAddPress(CB_DATA)}>
            Tambahkan Barang
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default AddBarangModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  input: {
    flex: 1,
    height: Scaler.scaleSize(48),
    marginRight: Size.SIZE_14,
  },

  inputNormal: {
    height: Scaler.scaleSize(48),
  },

  file: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.COLOR_DARK_GRAY,
  },

  fileLeft: {
    flex: 1,
    padding: Size.SIZE_8,
  },

  imagePreview: {
    borderRadius: 12,
    width: '35%',
    height: 180,
  },

  deleteLampiran: {
    marginTop: Size.SIZE_14,
    marginLeft: '12%',
    color: Colors.COLOR_RED,
  },
});
