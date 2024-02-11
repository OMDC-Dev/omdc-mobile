import {StyleSheet, View} from 'react-native';
import React from 'react';
import {ActivityIndicator, Text} from 'react-native-paper';

const BlankScreen = ({children, loading}) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.textMsg} variant="bodySmall">
          {children}
        </Text>
      )}
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

  textMsg: {
    textAlign: 'center',
  },
});
