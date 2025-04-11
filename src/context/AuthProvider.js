import * as React from 'react';
import {AuthContext} from '.';
import {removeData, storeData} from '../utils/store';

const AuthProvider = ({children}) => {
  //handle auth flow
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            user: action.user,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.user,
          };
        case 'SIGN_COMPLETE':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null,
          };
        case 'SET_REMOTE_NOTIF':
          return {
            ...prevState,
            remoteNotification: action.remoteNotification,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null,
      remoteNotification: null,
    },
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async user => {
        await storeData('USER_SESSION', user, true);
        dispatch({
          type: 'SIGN_IN',
          token: user?.userToken,
          user: user,
        });
      },
      signOut: async () => {
        await removeData('USER_SESSION');
        dispatch({type: 'SIGN_OUT'});
      },
      restoreToken: async data => {
        dispatch({
          type: 'RESTORE_TOKEN',
          token: data?.userToken,
          user: data,
        });
      },
      setRemoteNotif: data => {
        dispatch({
          type: 'SET_REMOTE_NOTIF',
          remoteNotification: data,
        });
      },
      remoteNotification: state.remoteNotification,
      user: state.user,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>
      {children(state)}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
