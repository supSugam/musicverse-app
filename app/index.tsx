import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/get-started/Welcome';
import Register from './screens/get-started/Register';
import OTPVerification from './screens/get-started/OTPVerification';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useEffect } from 'react';
import TabsLayout from './(tabs)/_layout';
import Login from './screens/Login';
import { LogBox } from 'react-native';
import TrackPlayer from '@/components/Player/TrackPlayer';
import MiniPlayer from '@/components/Player/MiniPlayer';
import AddToPlaylistStack from './screens/add-to-playlist';

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
        <>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="TabsLayout"
          >
            <Stack.Screen
              name="TrackPlayer"
              component={TrackPlayer}
              options={{
                headerShown: false,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="TabsLayout"
              component={TabsLayout}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Group
              screenOptions={{
                presentation: 'modal',
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="AddToPlaylist"
                component={AddToPlaylistStack}
              />
            </Stack.Group>
          </Stack.Navigator>
          <MiniPlayer />
        </>
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
        </Stack.Navigator>
      )}
    </>
  );
}
