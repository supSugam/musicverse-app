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
import AddToPlaylistSC1 from '@/components/Playlist/AddToPlaylistSC1';
import BackNavigator from '@/components/reusables/BackNavigator';
import CreatePlaylist from '@/components/Playlist/CreatePlaylist';

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

                contentStyle: {
                  backgroundColor: `rgba(0,0,0,0.5)`,
                  justifyContent: 'flex-end',
                },
              }}
            >
              <Stack.Screen
                name="AddToPlaylist"
                component={AddToPlaylistSC1}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  animationDuration: 200,
                  header: () => (
                    <BackNavigator showBackText title="Add to Playlist" />
                  ),
                }}
              />
              <Stack.Screen
                name="CreatePlaylist"
                component={CreatePlaylist}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_right',
                  animationDuration: 200,
                }}
              />
            </Stack.Group>
          </Stack.Navigator>
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
