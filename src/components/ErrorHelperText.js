import {StyleSheet} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {Colors, Scaler} from '../styles';

const ErrorHelperText = ({error}) => {
  if (!error) return null;

  return (
    <Text style={styles.main} variant={'labelSmall'}>
      {error}
    </Text>
  );
};

export default ErrorHelperText;

const styles = StyleSheet.create({
  main: {
    marginVertical: Scaler.scaleSize(8),
    color: Colors.COLOR_RED,
  },
});
