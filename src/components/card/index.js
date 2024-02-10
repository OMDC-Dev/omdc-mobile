import * as React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

const Card = ({children, style}) => {
  return <View style={[style, styles.container]}>{children}</View>;
};

export default Card;
