import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import React from 'react';
import {BlankScreen, Gap, Row} from '../../../components';
import {Button, Card, IconButton, Text, TextInput} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors, Scaler, Size} from '../../../styles';
import {fetchApi} from '../../../api/api';
import {WORKPLAN_PROGRESS} from '../../../api/apiRoutes';
import {API_STATES} from '../../../utils/constant';
import {SnackBarContext} from '../../../context';
import moment from 'moment';

const ProgressModal = () => {
  const [list, setList] = React.useState([]);
  const [progress, setProgress] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState();

  const {setSnakMessage, showSnak} = React.useContext(SnackBarContext);

  const navigation = useNavigation();
  const route = useRoute();

  const WP_ID = route.params?.id;

  async function getList(id) {
    setLoading(true);
    const {state, data, error} = await fetchApi({
      url: WORKPLAN_PROGRESS(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data);
      setLoading(false);
    } else {
      setLoading(false);
      setSnakMessage('Gagal mengambil progress, mohon coba lagi!');
      showSnak();
      console.log(error);
    }
  }

  async function saveProgress() {
    setLoading(true);

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_PROGRESS(WP_ID),
      method: 'POST',
      data: {
        progress: progress,
      },
    });

    if (state == API_STATES.OK) {
      setProgress('');
      setLoading(false);
      getList(WP_ID);

      setSnakMessage('Berhasil membuat progress');
      showSnak();
    } else {
      setLoading(false);
      setSnakMessage('Gagal menyimpan progress, silahkan coba lagi!');
      showSnak();
    }
  }

  async function updateProgress() {
    setLoading(true);

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_PROGRESS(list[selectedId].id),
      data: {
        progress: progress,
        wp_id: WP_ID,
      },
      method: 'PUT',
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setProgress('');
      setSelectedId(null);
      getList(WP_ID);

      setSnakMessage('Berhasil mengupdate progress');
      showSnak();
    } else {
      setLoading(false);
      setSnakMessage('Gagal mengupdate progress, silahkan coba lagi!');
      showSnak();
    }
  }

  async function deleteProgress(id) {
    setLoading(true);

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_PROGRESS(id),
      method: 'DELETE',
      data: {
        wp_id: WP_ID,
      },
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      getList(WP_ID);
    } else {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (WP_ID) {
      getList(WP_ID);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        keyboardVerticalOffset={72}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.scrollContainer}>
            <Row justify={'space-between'}>
              <View style={styles.titleContainer}>
                <Text variant={'titleMedium'} style={styles.textProgress}>
                  Progress
                </Text>
              </View>
              <IconButton
                icon={'close'}
                onPress={() => (loading ? null : navigation.goBack())}
              />
            </Row>

            <View style={styles.mainContainer}>
              {/** List Container */}
              {list?.length > 0 ? (
                <FlatList
                  data={list}
                  renderItem={({item, index}) => (
                    <Card
                      style={{
                        marginHorizontal: 4,
                        marginTop: 4,
                        marginBottom: 8,
                      }}>
                      <Card.Content>
                        <Row justify={'space-between'}>
                          <View style={{width: '70%', marginRight: 8}}>
                            <Text variant={'labelMedium'}>{item.progress}</Text>
                            <Text
                              variant={'labelSmall'}
                              style={styles.textTime}>
                              {moment(item.createdAt).format('lll')}
                            </Text>
                          </View>
                          <IconButton
                            onPress={() => {
                              setSelectedId(index);
                              setProgress(item.progress);
                            }}
                            icon={'pencil-outline'}
                            iconColor={Colors.COLOR_GRAY}
                          />
                          <IconButton
                            onPress={() => deleteProgress(item.id)}
                            icon={'trash-can-outline'}
                            iconColor={Colors.COLOR_GRAY}
                          />
                        </Row>
                      </Card.Content>
                    </Card>
                  )}
                />
              ) : (
                <BlankScreen loading={loading}>Belum ada progress</BlankScreen>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          {selectedId != null ? (
            <Card style={{marginBottom: Size.SIZE_14}}>
              <Card.Content style={{paddingVertical: 0, paddingRight: 0}}>
                <Row justify={'space-between'}>
                  <View style={{width: '70%', marginRight: 8}}>
                    <Text variant={'labelMedium'}>
                      {list[selectedId]?.progress}
                    </Text>
                  </View>
                  <IconButton
                    onPress={() => {
                      setProgress('');
                      setSelectedId(null);
                    }}
                    icon={'close'}
                    iconColor={Colors.COLOR_GRAY}
                  />
                </Row>
              </Card.Content>
            </Card>
          ) : null}

          <Row>
            <TextInput
              style={styles.input}
              mode={'outlined'}
              multiline
              editable={!loading}
              placeholder={'Masukan progress'}
              placeholderTextColor={Colors.COLOR_DARK_GRAY}
              value={progress}
              onChangeText={tx => setProgress(tx)}
            />
            <Gap w={8} />
            <Button
              loading={loading}
              onPress={() => {
                selectedId != null ? updateProgress() : saveProgress();
              }}
              disabled={loading || !progress}
              mode={'contained'}>
              {selectedId != null ? 'Update' : 'Tambah'}
            </Button>
          </Row>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProgressModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_WHITE,
  },

  flexContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  mainContainer: {
    flex: 1,
    padding: Size.SIZE_14,
  },

  bottomContainer: {
    padding: Size.SIZE_14,
    backgroundColor: Colors.COLOR_WHITE,
    borderTopWidth: 0.5,
    borderColor: Colors.COLOR_LIGHT_GRAY,
  },

  input: {
    flex: 1,
    maxHeight: Scaler.scaleSize(120),
  },

  titleContainer: {
    marginLeft: Size.SIZE_14,
  },

  textProgress: {
    color: Colors.COLOR_BLACK,
  },

  textTime: {
    marginTop: Size.SIZE_8,
    color: Colors.COLOR_GRAY,
  },
});
