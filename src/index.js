import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthStackScreen, MainScreen, SplashStack} from './navigator';
import {AuthContext} from './context';
import {retrieveData} from './utils/store';
import SplashScreen from './screens/splash';

const App = () => {
  //handle auth flow
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  //   React.useEffect(() => {
  //     // Fetch the token from storage then navigate to our appropriate place
  //     const bootstrapAsync = async () => {
  //       let userToken;

  //       try {
  //         userToken = await retrieveData('token', false);
  //       } catch (e) {
  //         // Restoring token failed
  //       }

  //       // After restoring token, we may need to validate it in production apps

  //       // This will switch to the App screen or Auth screen and this loading
  //       // screen will be unmounted and thrown away.
  //       dispatch({type: 'RESTORE_TOKEN', token: userToken});
  //     };

  //     bootstrapAsync();
  //   }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      restoreToken: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({type: 'RESTORE_TOKEN', token: data});
      },
    }),
    [],
  );

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        {state.isLoading ? (
          <SplashStack />
        ) : state.userToken == null ? (
          <AuthStackScreen />
        ) : (
          <MainScreen />
        )}
      </AuthContext.Provider>
    </NavigationContainer>
  );
};

export default App;
