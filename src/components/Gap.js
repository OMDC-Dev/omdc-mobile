import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Scaler} from '../styles';

const Gap = ({w, h}) => {
  return (
    <View
      style={{
        height: Scaler.scaleSize(h) || 0,
        width: Scaler.scaleSize(w) || 0,
      }}
    />
  );
};

export default Gap;
