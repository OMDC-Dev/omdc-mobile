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
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Icon,
  IconButton,
  MD3Colors,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {fetchApi} from '../../../api/api';
import {WORKPLAN_COMMENT, WORKPLAN_PROGRESS} from '../../../api/apiRoutes';
import {BlankScreen, Gap, Row} from '../../../components';
import ModalView from '../../../components/modal';
import {Colors, Scaler, Size} from '../../../styles';
import {API_STATES} from '../../../utils/constant';
import {AuthContext} from '../../../context';
import {Image} from 'react-native';

const CommentModal = () => {
  const [list, setList] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showSelectFile, setShowSelectFile] = React.useState(false);

  const [visible, setVisible] = React.useState(false);
  const [type, setType] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const {user} = React.useContext(AuthContext);

  const navigation = useNavigation();
  const route = useRoute();

  const WP_ID = route.params?.id;
  const WP_COMMENT = route.params?.comment;
  const WP_IS_DONE = route?.params.isDone;

  async function getList(id) {
    setLoading(true);

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_COMMENT(id),
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setList(data.rows);
      setLoading(false);
    } else {
      setLoading(false);
      setType('failed');
      setVisible(true);
    }
  }

  async function sendComment() {
    setLoading(true);

    let COMMENT_VALUE = comment;

    setComment('');

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_COMMENT(WP_ID),
      method: 'POST',
      data: {
        message: COMMENT_VALUE,
        comment_id: null,
        attachment: selectedFile,
      },
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setComment('');
      setSelectedFile(null);
      getList(WP_ID);
    } else {
      setLoading(false);
      setComment('');
      setSelectedFile(null);
    }
  }

  // handle on pick from camera / gallery
  function onPickFromRes(data) {
    if (data.fileSize > 11000000) {
      setMessage('Ukuran file tidak boleh lebih dari 10 MB');
      setVisible(true);
      return;
    }

    const fileInfo = {
      name: data.fileName,
      size: data.fileSize,
      type: data.fileType,
    };

    setSelectedFile(data.base64);
    // setFileBeforeInfo(fileInfo);
  }

  React.useEffect(() => {
    if (WP_ID) {
      setList(WP_COMMENT);
      getList(WP_ID);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        keyboardVerticalOffset={72}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Row justify={'space-between'}>
          <View style={styles.titleContainer}>
            <Text variant={'titleMedium'} style={styles.textProgress}>
              Komentar
            </Text>
          </View>
          <IconButton
            icon={'close'}
            onPress={() => (loading ? null : navigation.goBack())}
          />
        </Row>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            nestedScrollEnabled>
            <View style={styles.mainContainer}>
              {/** List Container */}
              {list?.length > 0 ? (
                list.map((item, index) => {
                  return (
                    <Card
                      key={index}
                      style={{
                        marginHorizontal: 4,
                        marginTop: 4,
                        marginBottom: 8,
                        backgroundColor:
                          item.iduser == user.iduser
                            ? undefined
                            : Colors.COLOR_MCYAN,
                      }}>
                      <Card.Content>
                        <Text
                          style={[
                            styles.textName,
                            {
                              color:
                                user.iduser == item.iduser
                                  ? Colors.COLOR_PRIMARY
                                  : Colors.COLOR_BLACK,
                            },
                          ]}
                          variant={'labelMedium'}>
                          {item.create_by}
                        </Text>
                        <Gap h={8} />
                        <View>
                          <Text variant={'labelMedium'}>{item.message}</Text>
                          {item.attachment ? (
                            <>
                              <Gap h={8} />
                              <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                  navigation.navigate('PreviewModal', {
                                    file: item.attachment,
                                  });
                                }}>
                                <Image
                                  source={{
                                    uri: item.attachment,
                                  }}
                                  style={{
                                    height: Scaler.scaleSize(252),
                                    width: '100%',
                                    borderRadius: 8,
                                    margin: 8,
                                    alignSelf: 'center',
                                  }}
                                  resizeMode={'cover'}
                                />
                              </TouchableOpacity>
                            </>
                          ) : null}
                          <Text variant={'labelSmall'} style={styles.textTime}>
                            {moment(item.createdAt).format('lll')}
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  );
                })
              ) : (
                <BlankScreen loading={loading}>Belum ada komentar</BlankScreen>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Bottom Container */}
        {WP_IS_DONE ? null : (
          <View style={styles.bottomContainer}>
            {selectedFile ? (
              <Card style={{marginBottom: Size.SIZE_20, width: '60%'}}>
                <Card.Content style={{paddingVertical: 0, paddingRight: 0}}>
                  <Row justify={'space-between'}>
                    <Row>
                      <Icon source={'image-outline'} size={20} />
                      <Gap w={8} />
                      <Text variant={'labelSmall'}>Gambar Lampiran</Text>
                    </Row>
                    <IconButton
                      icon={'close'}
                      onPress={() => {
                        setSelectedFile(null);
                      }}
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
                placeholder={'Tambahkan komentar'}
                placeholderTextColor={Colors.COLOR_DARK_GRAY}
                value={comment}
                onChangeText={tx => setComment(tx)}
              />
              <Gap w={8} />
              {selectedFile ? null : (
                <IconButton
                  icon={'image-outline'}
                  onPress={() => setShowSelectFile(true)}
                />
              )}
              <Button
                loading={loading}
                onPress={() => sendComment()}
                disabled={loading || !comment}
                mode={'contained'}>
                Kirim
              </Button>
            </Row>
          </View>
        )}
      </KeyboardAvoidingView>
      <ModalView
        visible={visible}
        type={type}
        toggle={() => setVisible(false)}
        onPress={() => {}}
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

      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default CommentModal;

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
    flex: 1,
    maxHeight: Scaler.scaleSize(120),
  },

  textName: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  titleContainer: {
    marginLeft: Size.SIZE_14,
  },

  textProgress: {
    color: Colors.COLOR_BLACK,
  },

  textTime: {
    marginTop: Size.SIZE_14,
    color: Colors.COLOR_GRAY,
    textAlign: 'right',
  },
});
