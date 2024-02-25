import {StyleSheet} from 'react-native';
import {Scaler} from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height: Scaler.scaleSize(96),
    width: Scaler.scaleSize(96),
  },
});

export default styles;
