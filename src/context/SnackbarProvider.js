import * as React from 'react';
import {SnackBarContext} from '.';
import {Snackbar} from 'react-native-paper';

const SnackBarProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SET_MESSAGE':
          return {
            ...prevState,
            message: action.snackMessage,
          };
        case 'SHOW':
          return {
            ...prevState,
            visible: action.visible,
          };
        case 'HIDE':
          return {
            ...prevState,
            visible: action.visible,
          };
      }
    },
    {
      visible: false,
      message: '',
    },
  );

  const context = React.useMemo(
    () => ({
      setSnakMessage: message => {
        dispatch({type: 'SET_MESSAGE', message: message});
      },
      showSnak: () => {
        dispatch({
          type: 'SHOW',
          visible: true,
        });
      },
      hideSnak: () => {
        dispatch({
          type: 'HIDE',
          visible: false,
        });
      },
    }),
    [state],
  );

  return (
    <SnackBarContext.Provider value={context}>
      {children}
      <Snackbar
        visible={state.visible}
        onDismiss={() =>
          dispatch({
            type: 'HIDE',
            visible: false,
          })
        }>
        {state.message}
      </Snackbar>
    </SnackBarContext.Provider>
  );
};

export default SnackBarProvider;
