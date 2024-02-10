import {StyleSheet} from 'react-native';
import {Colors, Size} from '../../styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_WHITE,
    padding: Size.SIZE_12,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.05,
    elevation: 2,
  },
});

export default styles;
