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
        case 'SHOW_MODAL':
          return {
            ...prevState,
            visible: action.visible,
            type: action.modal,
            message: action.message,
            action: action.action,
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
      action: () => {},
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
      showConfirmation: onConfirm => {
        dispatch({
          type: 'SHOW_MODAL',
          modal: 'confirmation',
          visible: true,
          message: '',
          action: onConfirm,
        });
      },
      showSuccess: onConfirm => {
        dispatch({
          type: 'SHOW_MODAL',
          modal: 'success',
          visible: true,
          message: '',
          action: onConfirm,
        });
      },
      showFailed: onConfirm => {
        dispatch({
          type: 'SHOW_MODAL',
          modal: 'failed',
          visible: true,
          message: '',
          action: onConfirm,
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
        onPress={() => {
          dispatch({type: 'HIDE_MODAL', visible: false});
          state.action ? state.action() : null;
        }}
        toggle={() => {
          dispatch({type: 'HIDE_MODAL', visible: false});
          //state.action();
        }}
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;
