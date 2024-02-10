import * as React from 'react';

const ModalProvider = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SHOW_LOADING':
          return {
            ...prevState,
            visible: action.visible,
            message: action.message,
            type: action.type,
          };
      }
    },
    {
      visible: false,
      message: '',
      type: 'loading',
    },
  );

  const modalContext = React.useMemo(
    () => ({
      showLoading: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );
};
