import React from 'react';
import Main from './src';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {Colors} from './src/styles';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.COLOR_PRIMARY,
    secondary: Colors.COLOR_SECONDARY,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <Main />
    </PaperProvider>
  );
};

export default App;
