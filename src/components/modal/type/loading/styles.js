import {StyleSheet} from 'react-native';
import {Scaler} from '../../../../styles';

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
  },
  container: {
    width: Scaler.scaleSize(62),
    height: Scaler.scaleSize(62),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
