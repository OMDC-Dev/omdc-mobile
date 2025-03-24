import * as React from 'react';
import {ModalContext} from '.';
import ModalView from '../components/modal';

const ModalProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SHOW_LOADING':
          return {
            ...prevState,
            visible: action.visible,
            type: action.modal,
          };
        case 'SHOW_MESSAGE':
          return {
            ...prevState,
            visible: action.visible,
            type: action.modal,
            message: action.message,
          };
        case 'HIDE_MODAL':
          return {
            ...prevState,
            visible: action.visible,
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
      showLoading: () => {
        dispatch({type: 'SHOW_LOADING', modal: 'loading', visible: true});
      },
      showMessage: msg => {
        dispatch({
          type: 'SHOW_MESSAGE',
          modal: 'message',
          visible: true,
          message: msg,
        });
      },
      hideModal: () => {
        dispatch({type: 'HIDE_MODAL', visible: false});
      },
    }),
    [state],
  );

  return (
    <ModalContext.Provider value={modalContext}>
      {children}
      <ModalView
        type={state.type}
        visible={state.visible}
        message={state.message}
        onPress={() => dispatch({type: 'HIDE_MODAL', visible: false})}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
