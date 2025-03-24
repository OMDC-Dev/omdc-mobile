import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Colors, Scaler} from '../styles';

const Container = ({children, style, useAvoidingKeyboard}) => {
  if (useAvoidingKeyboard) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {children}
      </KeyboardAvoidingView>
    );
  }
  return <View style={[styles.container, style]}>{children}</View>;
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_SECONDARY,
    paddingTop: Platform.OS == 'ios' ? Scaler.scaleSize(38) : 0,
  },
});
