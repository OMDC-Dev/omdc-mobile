import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Dropdown, Gap, Header, InputLabel, Row} from '../../../components';
import WorkplanTypeDropdown from '../../../components/dropdown/workplan/WokrplanTypeDropdown';
import {Colors, Scaler, Size} from '../../../styles';
import {ScrollView} from 'react-native';
import {Card, Icon, Text, TextInput} from 'react-native-paper';
import ModalView from '../../../components/modal';
import {getDateFormat} from '../../../utils/utils';

const WorkplanScreen = () => {
  // date section
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const [dateType, setDateType] = React.useState();

  // other
  const [cabang, setCabang] = React.useState();
  const [perihal, setPerihal] = React.useState();
  const [kategori, setKategori] = React.useState();

  console.log('cabang', cabang);

  return (
    <View style={styles.container}>
      <Header title={'Buat Workplan'} />
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
            Data Workplan
          </Text>

          <Gap h={14} />
          <InputLabel>Jenis Workplan</InputLabel>
          <WorkplanTypeDropdown />

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
          <InputLabel>Deskripsi</InputLabel>
          <TextInput
            style={styles.input}
            mode={'outlined'}
            placeholder={'Deskripsi'}
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
    </View>
  );
};

export default WorkplanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  // text

  subtitle: {
    color: Colors.COLOR_PRIMARY,
  },
});
