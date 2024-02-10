import * as React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';

const Touchable = ({onPress, style, children, disabled}) => {
  return (
    <TouchableOpacity
      style={[style, styles.container]}
      activeOpacity={0.6}
      onPress={disabled ? null : onPress ? onPress : null}>
      {children}
    </TouchableOpacity>
  );
};

export default Touchable;
