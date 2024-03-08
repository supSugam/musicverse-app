import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/get-started/Welcome';
import Register from './screens/get-started/Register';
import OTPVerification from './screens/get-started/OTPVerification';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useEffect } from 'react';
import TabsLayout from './(tabs)/_layout';
import Login from './screens/Login';
import { LogBox } from 'react-native';
import AddToPlaylistScreen from './screens/add-to-playlist';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const Stack = createNativeStackNavigator();

export default function index() {
  const { currentUser, initialize } = useAuthStore((state) => state);

  useEffect(() => {
    const onInitialize = async () => {
      await initialize();
    };

    onInitialize();
  }, [initialize]);

  return (
    <>
      {currentUser !== null ? (
        <TabsLayout />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true,
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="OTPVerification"
            component={OTPVerification}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddToPlaylistTabs"
            component={AddToPlaylistScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
}
