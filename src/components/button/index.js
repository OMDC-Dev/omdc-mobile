import * as React from 'react';
import {Button} from 'react-native-paper';

const MaterialButton = props => (
  <Button {...props} mode="contained">
    {props.children}
  </Button>
);

export default MaterialButton;
