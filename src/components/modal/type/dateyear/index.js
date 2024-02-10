import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MonthPicker, {
  ACTION_DATE_SET,
  ACTION_DISMISSED,
  ACTION_NEUTRAL,
} from 'react-native-month-year-picker';

const DateYearModal = ({cb}) => {
  function onSuccess(date) {
    cb({state: 'SUCCESS', value: date});
  }

  function onNeutral(date) {
    cb({state: 'NEUTRAL', value: date});
  }

  function onCancel() {
    cb({state: 'CANCEL', value: null});
  }

  const onValueChange = (event, newDate) => {
    switch (event) {
      case ACTION_DATE_SET:
        onSuccess(newDate);
        break;
      case ACTION_NEUTRAL:
        onNeutral(newDate);
        break;
      case ACTION_DISMISSED:
      default:
        onCancel(); //when ACTION_DISMISSED new date will be undefined
    }
  };

  // set minimum
  const CURRENT_YEAR = new Date().getFullYear();
  const CURRENT_MONTH = new Date().getMonth();

  console.log(CURRENT_MONTH);

  return (
    <View style={styles.container}>
      <MonthPicker
        onChange={onValueChange}
        value={new Date()}
        minimumDate={new Date(CURRENT_YEAR - 3, CURRENT_MONTH)}
        maximumDate={new Date(CURRENT_YEAR, CURRENT_MONTH)}
        locale="id"
      />
    </View>
  );
};

export default DateYearModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
