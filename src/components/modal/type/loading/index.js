import * as React from 'react';
import {ActivityIndicator} from 'react-native';
import {Colors} from '../../../../styles';
import Card from '../../../card';
import styles from './styles';

const ModalLoading = () => {
  return (
    <Card style={styles.container}>
      <ActivityIndicator color={Colors.COLOR_ACCENT} />
    </Card>
  );
};

export default ModalLoading;
