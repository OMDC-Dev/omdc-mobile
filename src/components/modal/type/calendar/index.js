import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Calendar} from 'react-native-calendars';
import {Colors, Scaler, Size} from '../../../../styles';
import Row from '../../../Row';
import {Button} from 'react-native-paper';

const CalendarModal = ({onSave, onCancel, value}) => {
  const [selected, setSelected] = React.useState('');

  React.useEffect(() => {
    if (value) {
      value(selected);
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      <View style={styles.rowPadding}>
        <Row>
          <Button onPress={onCancel}>Batal</Button>
          <View style={styles.gapButton} />
          <Button onPress={onSave}>Simpan</Button>
        </Row>
      </View>

      <Calendar
        style={{
          height: Scaler.scaleSize(320),
        }}
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'orange',
          },
        }}
      />
    </View>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_8,
    borderRadius: 8,
  },

  gapButton: {
    flex: 1,
  },

  rowPadding: {
    paddingBottom: Size.SIZE_10,
  },
});
