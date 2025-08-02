import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Row = ({children, style, justify}) => {
  return (
    <View
      style={[styles.row, style, {justifyContent: justify || 'flex-start'}]}>
      {children}
    </View>
  );
};

export default Row;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
