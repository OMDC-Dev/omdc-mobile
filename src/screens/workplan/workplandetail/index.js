import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import {Colors, Scaler, Size} from '../../../styles';
import {Button, Card, Chip, Icon, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalView from '../../../components/modal';
import {getDateFormat} from '../../../utils/utils';
import {SnackBarContext} from '../../../context';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {Pagination} from 'react-native-reanimated-carousel';
import {fetchApi} from '../../../api/api';
import {WORKPLAN, WORKPLAN_UPDATE} from '../../../api/apiRoutes';
import {API_STATES, WORKPLAN_STATUS} from '../../../utils/constant';

const WorkplanDetailScreen = () => {
  // file
  const [showSelectFile, setShowSelectFile] = React.useState(false);

  const [fileBefore, setFileBefore] = React.useState();
  const [fileBeforeInfo, setFileBeforeInfo] = React.useState();
  const [fileAfter, setFileAfter] = React.useState();
  const [fileAfterInfo, setFileAfterInfo] = React.useState();
  const [fileType, setFileType] = React.useState('');

  const [showCalendar, setShowCalendar] = React.useState(false);
  const [endDate, setEndDate] = React.useState();

  const [cc, setCC] = React.useState();
  const {setSnakMessage, showSnak, hideSnak} =
    React.useContext(SnackBarContext);

  // other
  const [isLoading, setIsLoading] = React.useState(false);
  const [isHasUpdate, setIsHasUpdate] = React.useState(false);

  const [workplanDetail, setWorkplanDetail] = React.useState();

  // carousel
  const data = [...new Array(2).keys()];
  const width = Dimensions.get('window').width;
  const progress = useSharedValue(0);

  const navigation = useNavigation();
  const route = useRoute();

  const WP_ID = route.params?.id;

  let DETAIL_DATA = [
    {
      title: 'Jenis Workplan',
      key: 'jenis_workplan',
      alias: val => (val == 'APPROVAL' ? 'Approval' : 'Non Approval'),
      type: 'default',
    },
    {
      title: 'Tanggal Mulai',
      key: 'tanggal_mulai',
      alias: val => val,
      type: 'default',
    },
    {
      title: 'Tanggal Selesai',
      key: 'tanggal_selesai',
      alias: val => val,
      type: 'default',
    },
    {
      title: 'Cabang',
      key: 'cabang_detail',
      alias: val => val.nm_induk,
      type: 'default',
    },
    {
      title: 'Kategori',
      key: 'kategori',
      alias: val => val,
      type: 'default',
    },
  ];

  const renderStatus = status => {
    let title = '';
    let color = '';

    switch (status) {
      case WORKPLAN_STATUS.ON_PROGRESS:
        title = 'Dalam Proses';
        color = Colors.COLOR_ORANGE;
        break;
      case WORKPLAN_STATUS.PENDING:
        title = 'Ditunda';
        color = Colors.COLOR_MAMBER;
        break;
      case WORKPLAN_STATUS.REVISON:
        title = 'Perlu Revisi';
        color = Colors.COLOR_ORANGE;
        break;
      case WORKPLAN_STATUS.REJECTED:
        title = 'Ditolak';
        color = Colors.COLOR_RED;
        break;
      case WORKPLAN_STATUS.FINISH:
        title = 'Selesai';
        color = Colors.COLOR_MGREEN;
        break;
      default:
        title = '';
        color = '';
        break;
    }

    return (
      <Chip
        style={{
          backgroundColor: color ? color : Colors.COLOR_PRIMARY,
        }}>
        <Text variant={'labelMedium'} style={styles.textChipStatus}>
          {title}
        </Text>
      </Chip>
    );
  };

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

    if (fileType == 'BEFORE') {
      setFileBefore(data.base64);
      setFileBeforeInfo(fileInfo);
    } else {
      setFileAfter(data.base64);
      setFileAfterInfo(fileInfo);
    }

    setIsHasUpdate(true);
  }

  React.useEffect(() => {
    getWorkplanDetail();
  }, []);

  async function getWorkplanDetail() {
    setIsLoading(true);
    const {state, data, error} = await fetchApi({
      url: WORKPLAN + `?id=${WP_ID}`,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setWorkplanDetail(data);

      const mappedCC = data.cc_users?.map(item => item.iduser);
      setCC(mappedCC);

      setEndDate(data.tanggal_selesai);
    } else {
      setIsLoading(false);
      setSnakMessage('Gagal mengambil data, mohon coba lagi!');
      showSnak();
    }
  }

  const saveWorkplan = async () => {
    setIsLoading(true);
    const body = {
      tanggal_selesai: endDate,
      user_cc: cc,
      attachment_after: fileAfter,
      attachment_before: fileBefore,
      isUpdateAfter: false,
    };

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_UPDATE(WP_ID),
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setIsLoading(false);
      setSnakMessage('Berhasil menyimpan workplan');
      showSnak();
      setIsHasUpdate(false);
      getWorkplanDetail();
      //setIsChangeFile(false);
    } else {
      setIsLoading(false);
      setSnakMessage('Gagal menyimpan workplan, mohon coba lagi!');
      showSnak();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={'Detail'}
        right={
          <Button
            style={
              isHasUpdate
                ? undefined
                : {
                    backgroundColor: Colors.COLOR_GRAY,
                  }
            }
            disabled={!isHasUpdate}
            mode={'contained'}
            onPress={() => saveWorkplan()}>
            Simpan
          </Button>
        }
      />
      <ScrollView
        style={styles.mainContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 92}}>
        <Text style={styles.subtitle} variant={'titleSmall'}>
          Status
        </Text>
        <Gap h={8} />
        <Row justify={'space-between'}>
          {renderStatus(workplanDetail?.status)}
          <Text variant={'labelMedium'} style={styles.textValue}>
            25 Maret 2025
          </Text>
        </Row>

        <Gap h={24} />
        <Text style={styles.subtitle} variant={'titleSmall'}>
          Data Workplan
        </Text>
        <Gap h={8} />
        {DETAIL_DATA.map((item, index) => {
          return (
            <Row
              style={styles.rowContainer}
              justify={'space-between'}
              key={index}>
              <Text style={styles.textCaption} variant={'labelMedium'}>
                {item.title}
              </Text>
              <Text style={styles.textValue} variant={'labelMedium'}>
                {workplanDetail ? item.alias(workplanDetail[item.key]) : '-'}
              </Text>
            </Row>
          );
        })}
        <Gap h={8} />
        <Text style={styles.textCaption} variant={'labelMedium'}>
          Perihal
        </Text>
        <Gap h={14} />
        <Card>
          <Card.Content>
            <Text style={styles.textValue} variant={'labelMedium'}>
              {workplanDetail?.perihal}
            </Text>
          </Card.Content>
        </Card>
        <Gap h={16} />
        <Text style={styles.textCaption} variant={'labelMedium'}>
          Gambar
        </Text>
        <Gap h={16} />
        <Carousel
          width={width - Scaler.scaleSize(28)}
          height={width / 1.5}
          data={data}
          onProgressChange={progress}
          style={{
            width: width - Scaler.scaleSize(28),
          }}
          renderItem={({index}) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
              }}>
              <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
            </View>
          )}
        />
        <Pagination.Basic
          progress={progress}
          data={data}
          activeDotStyle={{
            backgroundColor: Colors.COLOR_PRIMARY,
          }}
          dotStyle={{
            backgroundColor: Colors.COLOR_GRAY,
            borderRadius: 50,
            margin: 4,
          }}
          containerStyle={{marginTop: 10}}
        />

        <Gap h={24} />
        <Text style={styles.subtitle} variant={'titleSmall'}>
          Data Tambahan
        </Text>
        <Gap h={8} />
        <InputLabel>Ubah Tanggal Selesai</InputLabel>
        <Card
          style={styles.card}
          mode={'outlined'}
          onPress={() => {
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
        <Gap h={14} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('WPHistoryModal', {
              data: workplanDetail?.workplant_date_history,
            })
          }>
          <Text style={styles.textHistoryChange} variant={'labelMedium'}>
            Lihat riwayat perubahan
          </Text>
        </TouchableOpacity>

        {workplanDetail?.attachment_before ? null : (
          <>
            <Gap h={14} />
            <InputLabel>Gambar Awal ( Opsional maks 10 MB )</InputLabel>
            <FilePlaceholder
              file={fileBefore}
              fileInfo={fileBeforeInfo}
              onSelectPress={() => {
                setShowSelectFile(true);
                setFileType('BEFORE');
              }}
              onClosePress={() => {
                setFileBeforeInfo({});
                setFileBefore(null);
              }}
              navigation={navigation}
            />
          </>
        )}

        <Gap h={14} />
        <InputLabel>Gambar Akhir ( Opsional maks 10 MB )</InputLabel>
        <FilePlaceholder
          file={fileAfter}
          fileInfo={fileAfterInfo}
          onSelectPress={() => {
            setShowSelectFile(true);
            setFileType('AFTER');
          }}
          onClosePress={() => {
            setFileBeforeInfo({});
            setFileBefore(null);
          }}
          navigation={navigation}
        />

        <Gap h={14} />
        <InputLabel>CC ( Opsional )</InputLabel>
        <Dropdown.WorkplanCCDropdown
          value={cc}
          onChange={val => {
            setCC(val);
            setIsHasUpdate(true);
          }}
        />

        <Gap h={24} />
        <Text style={styles.subtitle} variant={'titleSmall'}>
          Progress
        </Text>
        <Gap h={14} />
        <Button
          onPress={() => navigation.navigate('WPProgressModal', {id: WP_ID})}
          mode={'outlined'}>
          Lihat Semua Progress
        </Button>

        <Gap h={24} />
        <Text style={styles.subtitle} variant={'titleSmall'}>
          Komentar
        </Text>
        <Gap h={14} />
        <Button mode={'outlined'}>Lihat Semua Komentar</Button>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button
            style={[styles.actionButton, styles.actionPending]}
            mode={'contained'}>
            Set ke Pending
          </Button>
          <Button
            style={[styles.actionButton, styles.actionDone]}
            mode={'contained'}>
            Set ke Selesai
          </Button>
          <Button
            style={[styles.actionButton, styles.actionDelete]}
            mode={'contained'}>
            Hapus Workplan
          </Button>
        </ScrollView>
      </View>

      <ModalView
        type={'calendar'}
        visible={showCalendar}
        onSaveCalendar={() => {
          setShowCalendar(false);
          setIsHasUpdate(true);
        }}
        onCancelCalendar={() => setShowCalendar(false)}
        dateCallback={val => {
          if (val) {
            setEndDate(getDateFormat(val));
          }
        }}
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

export default WorkplanDetailScreen;

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

  rowContainer: {
    paddingVertical: Size.SIZE_8,
  },

  bottomContainer: {
    backgroundColor: Colors.COLOR_WHITE,
    borderTopWidth: 0.5,
    borderColor: Colors.COLOR_LIGHT_GRAY,
    padding: Size.SIZE_12,
  },

  actionButton: {
    marginHorizontal: 4,
  },

  actionPending: {
    backgroundColor: Colors.COLOR_MAMBER,
  },

  actionDone: {
    backgroundColor: Colors.COLOR_MGREEN,
  },

  actionDelete: {
    backgroundColor: Colors.COLOR_MRED,
  },

  // text
  textCaption: {
    color: Colors.COLOR_GRAY,
  },

  textValue: {
    color: Colors.COLOR_BLACK,
    fontWeight: 'bold',
  },

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },

  textHistoryChange: {
    color: Colors.COLOR_SECONDARY,
    fontWeight: '600',
  },

  textChipStatus: {
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
  },
});
