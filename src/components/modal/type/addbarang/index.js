import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
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

// OPT
const pickOpts = {
  maxHeight: 720,
  maxWidth: 480,
  quality: 0.75,
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

  console.log(selectedImage);

  const CB_DATA = {
    stock: qtyStock,
    request: qtyRequest,
    keterangan: keterangan || '',
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
          <Gap h={12} />
          <InputLabel>Lampiran</InputLabel>
          {selectedImage ? (
            <View style={styles.file}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  // navigation.navigate('Preview', {
                  //   file: result,
                  //   type: fileInfo.type,
                  // })
                  null
                }>
                <Row>
                  <Row style={styles.fileLeft}>
                    <Icon
                      source={'file-document-outline'}
                      size={40}
                      color={Colors.COLOR_DARK_GRAY}
                    />
                    <Gap w={8} />
                    <Text
                      style={{marginRight: Size.SIZE_24}}
                      numberOfLines={1}
                      variant={'labelLarge'}>
                      {selectedImage?.fileName <= 30
                        ? selectedImage?.fileName
                        : 'Lampiran'}
                    </Text>
                  </Row>
                  <IconButton
                    icon={'close'}
                    size={24}
                    iconColor={Colors.COLOR_DARK_GRAY}
                    onPress={() => {
                      setSelectedImage(null);
                    }}
                  />
                </Row>
              </TouchableOpacity>
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

          <Gap h={32} />
          <Button
            disabled={!qtyRequest || !qtyStock || qtyRequest < 1}
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
});
