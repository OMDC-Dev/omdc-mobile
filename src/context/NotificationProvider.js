import * as React from 'react';
import {AuthContext, NotificationContext} from '.';

const NotificationProvider = ({children}) => {
  //handle auth flow
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SET_REMOTE_NOTIF':
          return {
            ...prevState,
            remoteNotification: action.remoteNotification,
          };
      }
    },
    {
      remoteNotification: null,
    },
  );

  const notificationContext = React.useMemo(
    () => ({
      setRemoteNotif: data => {
        dispatch({
          type: 'SET_REMOTE_NOTIF',
          remoteNotification: data,
        });
      },
      remoteNotification: state.remoteNotification,
    }),
    [state],
  );

  return (
    <NotificationContext.Provider value={notificationContext}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
