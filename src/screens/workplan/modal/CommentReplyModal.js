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
  MD3LightTheme,
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

const StyledMessage = ({message}) => {
  // Cek apakah pesan diawali dengan "Membalas @UserID:"
  const match = message.match(/^Membalas (@[\w\s]+)\s*:\s*(.*)/);

  if (match) {
    const userId = match[1]; // "@UserID"
    const content = match[2]; // Isi pesan setelah ":"

    return (
      <Text variant={'labelMedium'}>
        <Text>Membalas </Text>
        <Text style={{fontWeight: 'bold', color: 'red'}}>{userId}</Text>
        <Text>: {content}</Text>
      </Text>
    );
  }

  // Jika tidak ada format membalas, tampilkan teks biasa
  return <Text>{message}</Text>;
};

const CommentReplyModal = () => {
  const [list, setList] = React.useState([]);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showSelectFile, setShowSelectFile] = React.useState(false);

  const [visible, setVisible] = React.useState(false);
  const [type, setType] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const [quoted, setQuoted] = React.useState();

  const {user} = React.useContext(AuthContext);

  const navigation = useNavigation();
  const route = useRoute();

  const WP_ID = route.params?.id;
  const WP_IS_DONE = route?.params.isDone;
  const SELECTED_COMMENT = route?.params?.data;

  async function sendComment() {
    setLoading(true);

    let COMMENT_VALUE = comment;

    setComment('');

    const {state, data, error} = await fetchApi({
      url: WORKPLAN_COMMENT(WP_ID),
      method: 'POST',
      data: {
        message: `Membalas @${
          quoted ? quoted?.create_by : SELECTED_COMMENT?.create_by
        } : ${COMMENT_VALUE}`,
        comment_id: SELECTED_COMMENT.id,
        attachment: selectedFile,
      },
    });

    if (state == API_STATES.OK) {
      setLoading(false);
      setComment('');
      setSelectedFile(null);
      setQuoted(null);
      setList(prev => [...prev, data.data]);
    } else {
      setLoading(false);
      setComment('');
      setSelectedFile(null);
    }
  }

  React.useEffect(() => {
    setList(SELECTED_COMMENT.replies);
  }, [SELECTED_COMMENT]);

  // handle on pick from camera / gallery
  function onPickFromRes(data) {
    if (data.fileSize > 11000000) {
      setMessage('Ukuran file tidak boleh lebih dari 10 MB');
      setVisible(true);
      return;
    }
    setSelectedFile(data.base64);
    // setFileBeforeInfo(fileInfo);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flexContainer}
        keyboardVerticalOffset={Platform.OS == 'ios' ? 72 : 32}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Row justify={'space-between'}>
          <View style={styles.titleContainer}>
            <Text variant={'titleMedium'} style={styles.textProgress}>
              Balasan Komentar
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
              <Card
                style={{
                  marginHorizontal: 4,
                  marginTop: 4,
                  marginBottom: 8,
                  backgroundColor:
                    SELECTED_COMMENT.iduser == user.iduser
                      ? MD3LightTheme.colors.background
                      : Colors.COLOR_MCYAN,
                }}>
                <Card.Content>
                  <Text
                    style={[
                      styles.textName,
                      {
                        color:
                          user.iduser == SELECTED_COMMENT.iduser
                            ? Colors.COLOR_PRIMARY
                            : Colors.COLOR_BLACK,
                      },
                    ]}
                    variant={'labelMedium'}>
                    {SELECTED_COMMENT.create_by}
                  </Text>
                  <Gap h={8} />
                  <View>
                    <Text variant={'labelMedium'}>
                      {SELECTED_COMMENT.message}
                    </Text>
                    {SELECTED_COMMENT.attachment ? (
                      <>
                        <Gap h={8} />
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            navigation.navigate('PreviewModal', {
                              file: SELECTED_COMMENT.attachment,
                            });
                          }}>
                          <Image
                            source={{
                              uri: SELECTED_COMMENT.attachment,
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
                    <Row style={{marginTop: 20}} justify={'space-between'}>
                      {/* <TouchableOpacity onPress={() => setQuoted(item)}>
                        <Text
                          style={{color: Colors.COLOR_DARK_BACKGROUND}}
                          variant={'labelSmall'}>
                          Balas
                        </Text>
                      </TouchableOpacity> */}
                      <Text variant={'labelSmall'} style={styles.textTime}>
                        {moment(SELECTED_COMMENT.createdAt).fromNow()}
                      </Text>
                    </Row>
                  </View>
                </Card.Content>
              </Card>
              {list.map((item, index) => {
                return (
                  <Card
                    key={index}
                    style={{
                      marginRight: 4,
                      marginLeft: 24,
                      marginTop: 4,
                      marginBottom: 8,
                      backgroundColor:
                        item.iduser == user.iduser
                          ? MD3LightTheme.colors.background
                          : Colors.COLOR_MCYAN,
                    }}>
                    <Card.Content>
                      <Text
                        style={[
                          {
                            fontWeight: 'bold',
                            color:
                              user.iduser == item.iduser
                                ? Colors.COLOR_PRIMARY
                                : Colors.COLOR_BLACK,
                          },
                        ]}
                        variant={'labelSmall'}>
                        {item.create_by}
                      </Text>
                      <Gap h={4} />
                      <View>
                        <StyledMessage message={item?.message} />
                        {item.attachment ? (
                          <>
                            <Gap h={4} />
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
                        <Row style={{marginTop: 8}} justify={'space-between'}>
                          <TouchableOpacity onPress={() => setQuoted(item)}>
                            <Text
                              style={{color: Colors.COLOR_DARK_BACKGROUND}}
                              variant={'labelSmall'}>
                              Balas
                            </Text>
                          </TouchableOpacity>
                          <Text variant={'labelSmall'} style={styles.textTime}>
                            {moment(item.createdAt).fromNow()}
                          </Text>
                        </Row>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Bottom Container */}
        {WP_IS_DONE ? null : (
          <View style={styles.bottomContainer}>
            {quoted ? (
              <Card style={{marginBottom: Size.SIZE_20}}>
                <Card.Content style={{paddingVertical: 0, paddingRight: 0}}>
                  <Row justify={'space-between'}>
                    <Text
                      style={{width: '80%'}}
                      variant={'labelSmall'}
                      numberOfLines={1}>
                      Membalas ke{' '}
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: Colors.COLOR_PRIMARY,
                        }}>
                        {quoted?.create_by}
                      </Text>
                      : {quoted?.message}
                    </Text>

                    <IconButton
                      icon={'close'}
                      onPress={() => {
                        setQuoted(null);
                      }}
                    />
                  </Row>
                </Card.Content>
              </Card>
            ) : null}
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

export default CommentReplyModal;

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
    color: Colors.COLOR_GRAY,
  },
});
