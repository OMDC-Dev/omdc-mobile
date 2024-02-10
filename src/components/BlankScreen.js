import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';

const BlankScreen = ({children}) => {
  return (
    <View style={styles.container}>
      <Text variant="bodySmall">{children}</Text>
    </View>
  );
};

export default BlankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
