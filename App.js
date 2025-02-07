import React from 'react';
import Main from './src';
import {
  ActivityIndicator,
  DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import {Colors} from './src/styles';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.COLOR_PRIMARY,
    secondary: Colors.COLOR_SECONDARY,
  },
};

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <PaperProvider theme={theme}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.COLOR_PRIMARY} />
        </View>
      )}
      <Main />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default App;
