import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import LoginScreen from '../screens/login';
import SplashScreen from '../screens/splash';

//create stack screen
const Stack = createNativeStackNavigator();

//create bottom tab
const Tab = createBottomTabNavigator();

//===================================
// ========== GAP ===================
// ==================================

export const SplashStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

//auth stack screen
export const AuthStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={LoginScreen} />
    </Stack.Navigator>
  );
};

//tab stack screen
export const MainScreen = () => {
  return (
    <Tab.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
