import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Button, Dropdown, Gap, Header, InputLabel, Row} from '../../components';
import {Colors, Scaler, Size} from '../../styles';
import {
  Card,
  Icon,
  IconButton,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import ModalView from '../../components/modal';
import {
  getDateFormat,
  hitungTotalNominal,
  imgToBase64,
  uriToBas64,
} from '../../utils/utils';
import {useNavigation, useRoute} from '@react-navigation/native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {fetchApi} from '../../api/api';
import {GET_CABANG, SUPERUSER} from '../../api/apiRoutes';
import {API_STATES} from '../../utils/constant';
import {AuthContext} from '../../context';
import {formatRupiah} from '../../utils/rupiahFormatter';

const PengajuanScreen = () => {
  const [showCalendar, setShowCalendar] = React.useState(false);

  const [fileInfo, setFileInfo] = React.useState();

  // user session
  const {user} = React.useContext(AuthContext);

  console.log(user);

  // input state
  const [jenis, setJenis] = React.useState();
  const [coa, setCoa] = React.useState();
  const [cabang, setCabang] = React.useState();
  const [nominal, setNominal] = React.useState();
  const [nomorWA, setNomorWA] = React.useState(user.nomorwa || user.nomorWA);
  const [desc, setDesc] = React.useState();
  const [name, setName] = React.useState();
  const [result, setResult] = React.useState();
  const [selectDate, setSelectDate] = React.useState();
  const [item, setItem] = React.useState([]);
  const [admin, setAdmin] = React.useState();

  // dropdown state
  const [cabangList, setCabangList] = React.useState([]);
  const [adminList, setAdminList] = React.useState([]);

  // snackbar
  const [snack, setSnack] = React.useState();
  const [snackMsg, setSnackMsg] = React.useState('');

  const isNeedName = jenis == 'PR' || jenis == 'CAR' || jenis == 'PC';

  const disabledByType = () => {
    if (isNeedName) {
      return !name;
    }
  };

  const buttonDisabled =
    !jenis ||
    !coa ||
    !cabang ||
    !nominal ||
    !nomorWA ||
    !desc ||
    !result ||
    !selectDate ||
    !admin ||
    !item.length ||
    disabledByType();

  // navigation
  const navigation = useNavigation();
  const route = useRoute();

  // handle on add item
  React.useEffect(() => {
    const itemAdded = route?.params?.item;
    if (itemAdded) {
      setItem(prev => [...prev, {...itemAdded, id: item.length + 1}]);
    }
  }, [route?.params?.item]);

  // handle nominal on add
  React.useEffect(() => {
    const totalCount = hitungTotalNominal(item);
    setNominal('Rp. ' + formatRupiah(totalCount.toString()));
  }, [item]);

  // pick file
  async function pickFile() {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.pdf, types.images],
      });

      const size = pickerResult.size;

      if (size > 1200000) {
        setSnackMsg('Ukuran file tidak boleh lebih dari 1 MB');
        setSnack(true);
        return;
      }

      //   delete pickerResult.copyError;
      //   delete pickerResult.fileCopyUri;
      //   delete pickerResult.uri;

      const fileInfo = {
        name: pickerResult.name,
        size: pickerResult.size,
        type: pickerResult.type,
      };

      setFileInfo(fileInfo);

      const path = pickerResult.fileCopyUri.split('Caches/')[1];

      if (pickerResult.type == 'application/pdf') {
        const picker = await uriToBas64(path);
        setResult(picker);
      } else {
        const base64 = await imgToBase64(path);
        setResult(base64);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // API

  React.useEffect(() => {
    getCabang();
    getSuperUser();
  }, []);

  // get cabang
  async function getCabang() {
    try {
      const {state, data, error} = await fetchApi({
        url: GET_CABANG,
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        const doCabang = data.map(item => {
          return {label: item.nm_induk, value: item?.kd_induk};
        });
        setCabangList(doCabang);
      } else {
        setCabangList([]);
      }
    } catch (error) {
      setCabangList([]);
    }
  }

  // get admin
  async function getSuperUser() {
    try {
      const {state, data, error} = await fetchApi({
        url: SUPERUSER,
        method: 'GET',
      });

      if (state == API_STATES.OK) {
        const doAdmin = data.map(item => {
          return {label: item.nm_user, value: item?.iduser};
        });
        setAdminList(doAdmin);
      } else {
        setAdminList([]);
      }
    } catch (error) {
      setAdminList([]);
    }
  }

  function hapusDataById(id) {
    let data = item;
    data = data.filter(item => item.id !== id);
    setItem(data);
  }

  return (
    <View style={styles.container}>
      <Header title={'Reimbursement'} />
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
          <Text style={styles.subtitle} variant="titleSmall">
            Data Reimbursement
          </Text>

          <Gap h={14} />
          <InputLabel>Jenis Reimbursement</InputLabel>
          <Dropdown.TypeDropdown onChange={val => setJenis(val)} />

          <Gap h={6} />
          <InputLabel>COA</InputLabel>
          <Dropdown.CoaDropdown onChange={val => setCoa(val)} />

          <Gap h={6} />
          <InputLabel>Tanggal</InputLabel>
          <Card
            style={styles.card}
            mode={'outlined'}
            onPress={() => setShowCalendar(true)}>
            <Card.Content>
              <Row>
                <Icon
                  source={'calendar-range'}
                  size={20}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={10} />
                <Text variant="labelLarge">
                  {selectDate || 'Pilih Tanggal'}
                </Text>
              </Row>
            </Card.Content>
          </Card>

          <Gap h={6} />
          <InputLabel>Cabang</InputLabel>
          <Dropdown.CabangDropdown
            data={cabangList}
            loading={!cabangList}
            onChange={val => setCabang(val)}
          />

          <Gap h={6} />
          <InputLabel>Approval ke</InputLabel>
          <Dropdown.ApprovalDropdown
            data={adminList}
            loading={!adminList}
            onChange={val => setAdmin(val)}
          />

          <Gap h={6} />
          <InputLabel>Nomor Whatsapp</InputLabel>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            keyboardType={'phone-pad'}
            returnKeyType={'done'}
            placeholder={'Nomor Whatsapp'}
            defaultValue={user.nomorwa || user.nomorWA}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setNomorWA(text)}
            value={nomorWA}
          />

          {isNeedName && (
            <>
              <Gap h={6} />
              <InputLabel>Nama Vendor / Client</InputLabel>
              <TextInput
                style={styles.input}
                mode={'outlined'}
                placeholder={'Nama Vendor / Client'}
                placeholderTextColor={Colors.COLOR_DARK_GRAY}
                onChangeText={text => setName(text)}
                value={name}
              />
            </>
          )}

          <Gap h={6} />
          <InputLabel>Deskripsi</InputLabel>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            placeholder={'Deskripsi'}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setDesc(text)}
            value={desc}
          />

          <Gap h={6} />
          <InputLabel>Lampiran ( Maks. 1 MB )</InputLabel>
          <View style={fileInfo ? styles.fileContainer : undefined}>
            {fileInfo ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('Preview', {
                    file: result,
                    type: fileInfo.type,
                  })
                }>
                <Row>
                  <Row style={styles.fileLeft}>
                    <Icon
                      source={'file-document-outline'}
                      size={40}
                      color={Colors.COLOR_DARK_GRAY}
                    />
                    <Gap w={8} />
                    <Text numberOfLines={1} variant={'labelLarge'}>
                      {fileInfo?.name}
                    </Text>
                  </Row>
                  <IconButton
                    icon={'close'}
                    size={24}
                    iconColor={Colors.COLOR_DARK_GRAY}
                    onPress={() => {
                      setFileInfo(null);
                      setResult(null);
                    }}
                  />
                </Row>
              </TouchableOpacity>
            ) : (
              <IconButton
                icon={'plus-box-outline'}
                size={40}
                iconColor={Colors.COLOR_DARK_GRAY}
                onPress={() => pickFile()}
              />
            )}
          </View>
          <Gap h={6} />
          <InputLabel>Item</InputLabel>
          {item.length ? (
            <ScrollView>
              {item.map((item, index) => {
                return (
                  <View key={item + index}>
                    <Gap h={6} />
                    <Card style={styles.itemCard} mode={'elevated'}>
                      <Card.Content>
                        <Row>
                          <Text style={{flex: 1}} variant="labelLarge">
                            {item.name}
                          </Text>
                          <Text variant="labelLarge">Rp. {item.nominal}</Text>
                          <Gap w={10} />
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => hapusDataById(item.id)}>
                            <Icon
                              source={'close'}
                              size={24}
                              color={Colors.COLOR_DARK_GRAY}
                            />
                          </TouchableOpacity>
                        </Row>
                      </Card.Content>
                    </Card>
                    <Gap h={6} />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Card mode={'elevated'} style={styles.itemCard}>
              <Card.Content>
                <Row>
                  <Text variant="labelLarge">Belum ada item</Text>
                </Row>
              </Card.Content>
            </Card>
          )}
          <Gap h={12} />
          <Card
            style={styles.card}
            mode={'outlined'}
            onPress={() => navigation.navigate('PengajuanItem')}>
            <Card.Content>
              <Row>
                <Icon
                  source={'receipt'}
                  size={20}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={10} />
                <Text variant="labelLarge">{'Tambah Item'}</Text>
              </Row>
            </Card.Content>
          </Card>
          <Gap h={6} />
          <InputLabel>Total Nominal</InputLabel>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            editable={false}
            disabled
            keyboardType={'phone-pad'}
            returnKeyType={'done'}
            placeholder={'Nominal'}
            defaultValue={formatRupiah(0)}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            value={nominal}
          />
          <View style={styles.bottomContainer}>
            <Button
              disabled={buttonDisabled}
              onPress={() =>
                navigation.navigate('PengajuanBank', {
                  data: {
                    jenis: jenis,
                    coa: coa,
                    tanggal: selectDate,
                    cabang: cabang,
                    nominal: nominal,
                    nomor: nomorWA,
                    desc: desc,
                    file: result,
                    name: name,
                    item: item,
                    fileInfo: fileInfo,
                    admin: admin,
                  },
                })
              }>
              Lanjut
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalView
        type={'calendar'}
        visible={showCalendar}
        onSaveCalendar={() => setShowCalendar(false)}
        onCancelCalendar={() => setShowCalendar(false)}
        dateCallback={val => (val ? setSelectDate(getDateFormat(val)) : null)}
      />
      <Snackbar visible={snack} onDismiss={() => setSnack(false)}>
        {snackMsg}
      </Snackbar>
    </View>
  );
};

export default PengajuanScreen;

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

  card: {
    borderRadius: 8,
    backgroundColor: Colors.COLOR_WHITE,
  },

  bottomContainer: {
    marginBottom: Size.SIZE_10,
    marginTop: Scaler.scaleSize(38),
  },

  fileContainer: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.COLOR_DARK_GRAY,
  },

  fileLeft: {
    flex: 1,
    padding: Size.SIZE_8,
  },

  itemCard: {
    margin: 4,
  },

  // text

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
