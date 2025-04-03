import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {
  Dropdown,
  FilePlaceholder,
  Gap,
  Header,
  InputLabel,
  Row,
} from '../../../components';
import WorkplanTypeDropdown from '../../../components/dropdown/workplan/WokrplanTypeDropdown';
import {Colors, Scaler, Size} from '../../../styles';
import {ScrollView} from 'react-native';
import {Button, Card, Icon, Text, TextInput} from 'react-native-paper';
import ModalView from '../../../components/modal';
import {getDateFormat} from '../../../utils/utils';
import {ModalContext, SnackBarContext} from '../../../context';
import {useNavigation} from '@react-navigation/native';
import {fetchApi} from '../../../api/api';
import {WORKPLAN} from '../../../api/apiRoutes';
import {API_STATES} from '../../../utils/constant';

const WorkplanScreen = () => {
  // date section
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [dateType, setDateType] = React.useState();

  // other
  const [type, setType] = React.useState();
  const [cabang, setCabang] = React.useState();
  const [perihal, setPerihal] = React.useState();
  const [kategori, setKategori] = React.useState();
  const [cc, setCC] = React.useState();

  // file
  const [fileInfo, setFileInfo] = React.useState();
  const [file, setFile] = React.useState();
  const [showSelectFile, setShowSelectFile] = React.useState(false);

  // utils
  const {setSnakMessage, showSnak, hideSnak} =
    React.useContext(SnackBarContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const {showLoading, showConfirmation, showSuccess, hideModal, showFailed} =
    React.useContext(ModalContext);

  // navigation
  const navigation = useNavigation();

  // const
  const BUTTON_DISABLED =
    !type || !cabang || !startDate || !endDate || !perihal || !kategori;

  // handle on pick from camera / gallery
  function onPickFromRes(data) {
    if (data.fileSize > 11000000) {
      setSnakMessage('Ukuran file tidak boleh lebih dari 10 MB');
      showSnak();
      return;
    }

    const fileInfo = {
      name: data.fileName,
      size: data.fileSize,
      type: data.fileType,
    };

    setFile(data.base64);
    setFileInfo(fileInfo);
  }

  async function createWorkplan() {
    console.log('Creating Workplan...');
    showLoading();
    const body = {
      jenis_workplan: type,
      tanggal_mulai: startDate,
      tanggal_selesai: endDate,
      kd_induk: cabang,
      perihal: perihal,
      kategori: kategori,
      user_cc: cc,
      attachment_before: file,
    };

    const {state, data, error} = await fetchApi({
      url: WORKPLAN,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      hideModal();
      navigation.navigate('WorkplanDone');
    } else {
      showFailed();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Buat Work Plan'} />
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
            Data Work Plan
          </Text>

          <Gap h={14} />
          <InputLabel>Jenis Work Plan</InputLabel>
          <WorkplanTypeDropdown value={type} onChange={val => setType(val)} />

          <Gap h={6} />
          <InputLabel>Tanggal Mulai</InputLabel>
          <Card
            style={styles.card}
            mode={'outlined'}
            onPress={() => {
              setDateType('START');
              setShowCalendar(true);
            }}>
            <Card.Content>
              <Row>
                <Icon
                  source={'calendar-range'}
                  size={20}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={10} />
                <Text variant="labelLarge">
                  {startDate || 'Pilih Tanggal Mulai'}
                </Text>
              </Row>
            </Card.Content>
          </Card>

          <Gap h={6} />
          <InputLabel>Tanggal Selesai</InputLabel>
          <Card
            style={styles.card}
            mode={'outlined'}
            onPress={() => {
              setDateType('END');
              setShowCalendar(true);
            }}>
            <Card.Content>
              <Row>
                <Icon
                  source={'calendar-range'}
                  size={20}
                  color={Colors.COLOR_DARK_GRAY}
                />
                <Gap w={10} />
                <Text variant="labelLarge">
                  {endDate || 'Pilih Tanggal Selesai'}
                </Text>
              </Row>
            </Card.Content>
          </Card>

          <Gap h={6} />
          <InputLabel>Cabang</InputLabel>
          <Dropdown.CabangWorkplanDropdown
            onChange={val => setCabang(val)}
            value={cabang}
          />

          <Gap h={6} />
          <InputLabel>Perihal</InputLabel>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            placeholder={'Perihal'}
            placeholderTextColor={Colors.COLOR_DARK_GRAY}
            onChangeText={text => setPerihal(text)}
            value={perihal}
          />

          <Gap h={14} />
          <InputLabel>Kategori</InputLabel>
          <Dropdown.PaymentDropdown
            value={kategori}
            onChange={val => setKategori(val)}
          />

          <Gap h={14} />
          <InputLabel>CC ( Opsional )</InputLabel>
          <Dropdown.WorkplanCCDropdown
            value={cc}
            onChange={val => setCC(val)}
          />

          <Gap h={14} />
          <InputLabel>Before ( Opsional maks 10 MB )</InputLabel>
          <FilePlaceholder
            file={file}
            fileInfo={fileInfo}
            onSelectPress={() => {
              setShowSelectFile(true);
            }}
            onClosePress={() => {
              setFileInfo({});
              setFile(null);
            }}
            navigation={navigation}
          />

          <Gap h={32} />
          <Button
            onPress={() => showConfirmation(() => createWorkplan())}
            disabled={BUTTON_DISABLED}
            mode={'contained'}>
            Buat Work Plan
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <ModalView
        type={'calendar'}
        visible={showCalendar}
        onSaveCalendar={() => setShowCalendar(false)}
        onCancelCalendar={() => setShowCalendar(false)}
        dateCallback={val =>
          val
            ? dateType == 'START'
              ? setStartDate(getDateFormat(val))
              : setEndDate(getDateFormat(val))
            : null
        }
      />

      <ModalView
        type={'selectfile'}
        visible={showSelectFile}
        toggle={() => setShowSelectFile(!showSelectFile)}
        //pickFromFile={() => pickFile()}
        //fileCallback={cb => onPickFromRes(cb)}
        command={cmd => onPickFromRes(cmd)}
        pdfOnly={false}
        imageOnly={true}
      />

      <ModalView
        type={'loading'}
        visible={isLoading}
        toggle={() => setIsLoading(false)}
      />
    </SafeAreaView>
  );
};

export default WorkplanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
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

  ccContainer: {
    borderWidth: 1,
    borderColor: Colors.COLOR_GRAY,
    borderRadius: 4,
    paddingHorizontal: Size.SIZE_12,
    paddingVertical: Size.SIZE_16,
  },

  // text

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
