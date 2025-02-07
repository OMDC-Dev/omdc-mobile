import {StyleSheet} from 'react-native';
import {Colors, Scaler} from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.COLOR_BLACK,
  },

  logo: {
    height: Scaler.scaleSize(96),
    width: Scaler.scaleSize(96),
  },
});

export default styles;
