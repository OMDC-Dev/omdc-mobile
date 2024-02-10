import {StyleSheet} from 'react-native';
import {Colors, Typo} from '../../styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.COLOR_PRIMARY,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  containerInactive: {
    width: '100%',
    backgroundColor: Colors.COLOR_GRAY,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  containerInvert: {
    width: '100%',
    backgroundColor: Colors.COLOR_TRANSPARENT,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.COLOR_ACCENT,
  },

  containerInvertInactive: {
    width: '100%',
    backgroundColor: Colors.COLOR_TRANSPARENT,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.COLOR_GRAY,
  },

  //text style
  textTitle: {
    ...Typo.TextNormalRegular,
    color: Colors.COLOR_WHITE,
  },

  textTitleInactive: {
    ...Typo.TextNormalRegular,
    color: Colors.COLOR_DARK_GRAY,
  },

  textTitleInvert: {
    ...Typo.TextNormalRegular,
    color: Colors.COLOR_ACCENT,
  },

  textTitleInvertInactive: {
    ...Typo.TextNormalRegular,
    color: Colors.COLOR_DARK_GRAY,
  },
});

export default styles;
