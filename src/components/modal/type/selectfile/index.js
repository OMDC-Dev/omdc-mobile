import {Alert, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Card, Text} from 'react-native-paper';
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

// FROM CAMERA
async function pickFromCamera(cb) {
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
      cb ? cb(dataResult) : null;
    } else {
      console.log('USER CANCEL');
    }
  } catch (error) {
    console.log(error);
  }
}

// FROM GALLERY
async function pickFromGalery(cb) {
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
      cb ? cb(dataResult) : null;
    } else {
      console.log('USER CANCEL');
    }
  } catch (error) {
    console.log(error);
  }
}

const SelectFileModal = ({toggle, pickFromfile, value}) => {
  const [selected, setSelected] = React.useState();

  function checkPermission(type = '') {
    if (type == 'GALLERY') {
      check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
        if (result == 'granted') {
          pickFromGalery(val => setSelected(val));
        } else {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
            if (result == 'granted') {
              pickFromGalery(val => setSelected(val));
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
      check(PERMISSIONS.IOS.CAMERA).then(result => {
        if (result == 'granted') {
          pickFromCamera(val => setSelected(val));
        } else {
          request(PERMISSIONS.IOS.CAMERA).then(result => {
            if (result == 'granted') {
              pickFromCamera(val => setSelected(val));
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

  React.useEffect(() => {
    if (selected) {
      value(selected);
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Button
            onPress={() => {
              toggle();
              setTimeout(() => {
                Platform.OS == 'ios'
                  ? checkPermission('GALLERY')
                  : pickFromGalery(val => setSelected(val));
              }, 1000);
            }}
            style={styles.button}
            mode={'contained-tonal'}>
            Pilih dari galeri
          </Button>
          <Button
            onPress={() => {
              toggle();
              setTimeout(() => {
                Platform.OS == 'ios'
                  ? checkPermission('CAMERA')
                  : pickFromCamera(val => setSelected(val));
              }, 1000);
            }}
            style={styles.button}
            mode={'contained-tonal'}>
            Ambil dari kamera
          </Button>
          <Button
            onPress={() => {
              toggle();
              setTimeout(() => {
                pickFromfile();
              }, 1000);
            }}
            style={styles.button}
            mode={'contained-tonal'}>
            Pilih dari file
          </Button>
          <Button onPress={toggle} style={styles.button} mode={'text'}>
            Batalkan
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default SelectFileModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  button: {
    borderRadius: 8,
    marginVertical: 4,
  },
});
