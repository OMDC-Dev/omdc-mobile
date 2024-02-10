import {StyleSheet} from 'react-native';
import {Colors, Size, Typo} from '../../../../styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Size.SIZE_12,
    paddingHorizontal: Size.SIZE_18,
  },

  buttonOk: {
    padding: Size.SIZE_8,
    marginTop: Size.SIZE_14,
  },

  //text style

  textMessage: {
    ...Typo.TextNormalRegular,
  },

  textButton: {
    ...Typo.TextNormalBold,
    color: Colors.COLOR_ACCENT,
  },
});

export default styles;
