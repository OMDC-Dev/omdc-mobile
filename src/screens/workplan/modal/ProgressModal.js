import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Card, IconButton, Text, TextInput} from 'react-native-paper';
import {fetchApi} from '../../../api/api';
import {WORKPLAN_PROGRESS} from '../../../api/apiRoutes';
import {BlankScreen, Gap, Row} from '../../../components';
import ModalView from '../../../components/modal';
import {Colors, Scaler, Size} from '../../../styles';
import {API_STATES} from '../../../utils/constant';

const ProgressModal = () => {
  const [list, setList] = React.useState([]);
  const [progress, setProgress] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [selectedId, setSelectedId] = React.useState();

  const [visible, setVisible] = React.useState(false);
  const [type, setType] = React.useState(false);
  const [context, setContext] = React.useState('');

  const navigation = useNavigation();
  const route = useRoute();

  const WP_ID = route.params?.id;
  const WP_SELECTED = route.params?.selected;
  const WP_IS_DONE = route?.params.isDone;

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
      setType('failed');
      setVisible(true);
    }
  }

  async function saveProgress() {
    setContext('SAVE');
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

      setType('success');
      setVisible(true);
    } else {
      setLoading(false);
      setType('failed');
      setVisible(true);
    }
  }

  async function updateProgress() {
    setContext('UPDATE');
    setLoading(true);

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_PROGRESS(selectedId),
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

      setType('success');
      setVisible(true);
    } else {
      setLoading(false);
      setType('failed');
      setVisible(true);
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

      setType('success');
      setVisible(true);
      setSelectedId(null);
    } else {
      setLoading(false);
      setType('failed');
      setVisible(true);
    }
  }

  // React.useEffect(() => {
  //   if (WP_ID) {
  //     getList(WP_ID);
  //   }
  // }, []);

  React.useEffect(() => {
    if (WP_SELECTED) {
      setProgress(WP_SELECTED.progress);
      setSelectedId(WP_SELECTED.id);
    }
  }, [WP_SELECTED]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        keyboardVerticalOffset={72}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            style={styles.scrollContainer}>
            <View style={styles.mainContainer}>
              {list?.length > 0 ? (
                list.map((item, index) => {
                  return (
                    <Card
                      key={index}
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
                          {WP_IS_DONE ? null : (
                            <>
                              <IconButton
                                onPress={() => {
                                  setSelectedId(index);
                                  setProgress(item.progress);
                                }}
                                icon={'pencil-outline'}
                                iconColor={Colors.COLOR_GRAY}
                              />
                              <IconButton
                                onPress={() => {
                                  setSelectedId(index);
                                  setContext('delete');
                                  setType('confirmation');
                                  setVisible(true);
                                }}
                                icon={'trash-can-outline'}
                                iconColor={Colors.COLOR_GRAY}
                              />
                            </>
                          )}
                        </Row>
                      </Card.Content>
                    </Card>
                  );
                })
              ) : (
                <BlankScreen loading={loading}>Belum ada progress</BlankScreen>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback> */}

        {/* Bottom Container */}
        {WP_IS_DONE ? null : (
          <View style={styles.bottomContainer}>
            {/* {selectedId != null && context !== 'delete' ? (
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
            ) : null} */}

            <View>
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
              <Gap h={24} />
              <Button
                loading={loading}
                onPress={() => {
                  WP_SELECTED != null ? updateProgress() : saveProgress();
                }}
                disabled={loading || !progress}
                mode={'contained'}>
                {WP_SELECTED != null ? 'Update' : 'Tambah'}
              </Button>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
      <ModalView
        visible={visible}
        type={type}
        toggle={() => setVisible(false)}
        onPress={() => setVisible(false)}
        onModalHide={() => {
          if (type == 'success') {
            navigation.goBack();
          }
        }}
      />
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
    paddingHorizontal: Size.SIZE_14,
    paddingTop: Size.SIZE_14,
    paddingBottom: 92,
  },

  bottomContainer: {
    padding: Size.SIZE_14,
    backgroundColor: Colors.COLOR_WHITE,
    borderTopWidth: 0.5,
    borderColor: Colors.COLOR_LIGHT_GRAY,
  },

  input: {
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
