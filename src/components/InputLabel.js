import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {Colors, Size} from '../styles';

const InputLabel = ({children, style}) => {
  return (
    <Text style={[styles.container, style]} variant="labelMedium">
      {children}
    </Text>
  );
};

export default InputLabel;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Size.SIZE_10,
    color: Colors.COLOR_DARK_GRAY,
  },
});
