import * as React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Colors} from '../../styles';
import styles from './styles';

const Button = ({
  upperCase = false,
  isLoading = false,
  disabled = false,
  invert = false,
  title = 'This is Button',
  buttonStyle,
  textStyle,
  onPress,
}) => {
  //define button and text style based on condition
  const _containerStyle = () => {
    if (!invert) {
      if (!disabled && !isLoading) {
        return {button: styles.container, text: styles.textTitle};
      } else {
        return {
          button: styles.containerInactive,
          text: styles.textTitleInactive,
        };
      }
    } else {
      if (!disabled && !isLoading) {
        return {button: styles.containerInvert, text: styles.textTitleInvert};
      } else {
        return {
          button: styles.containerInvertInactive,
          text: styles.textTitleInvertInactive,
        };
      }
    }
  };

  //handle is Loading statment
  const _renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          color={invert ? Colors.COLOR_GRAY : Colors.COLOR_WHITE}
        />
      );
    } else {
      return (
        <Text style={[textStyle, _containerStyle().text]}>
          {upperCase ? title.toUpperCase() : title}
        </Text>
      );
    }
  };

  //main render
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.6}
      style={[buttonStyle, _containerStyle().button]}
      onPress={disabled || isLoading ? null : onPress ?? null}>
      {_renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
