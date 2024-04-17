import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/get-started/Welcome';
import Register from './screens/get-started/Register';
import OTPVerification from './screens/get-started/OTPVerification';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useEffect, useState } from 'react';
import TabsLayout from './(tabs)/_layout';
import Login from './screens/Login';
import { LogBox } from 'react-native';
import TrackPlayer from '@/components/Player/TrackPlayer';
import AddToPlaylistSC1 from '@/components/Playlist/AddToPlaylistSC1';
import BackNavigator from '@/components/reusables/BackNavigator';
import CreatePlaylist from '@/components/Playlist/CreatePlaylist';
import UpdatePlaylist from '@/components/Playlist/UpdatePlaylist';
import UpdateAlbum from '@/components/Albums/UpdateAlbum';
import ProfileSetup from './screens/get-started/ProfileSetup';
import Notifications from '@/components/Notifications/Notifications';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { toastResponseMessage } from '@/utils/toast';
import { useNavigation } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import * as ExpoNotifications from 'expo-notifications';
import { CommonActions } from '@react-navigation/native';
import { usePlayerStore } from '@/services/zustand/stores/usePlayerStore';
import RNTrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from 'react-native-track-player';
import * as Linking from 'expo-linking';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import FollowerFollowingTabs from '@/components/Follower/FollowerFollowingTabs';
import ProfilePage from './(tabs)/profile';
import AlbumPage from './(tabs)/album';
import COLORS from '@/constants/Colors';
import Membership from '@/components/Membership/Membership';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createNativeStackNavigator();

RNTrackPlayer.registerPlaybackService(() => require('./service'));

export default function index() {
  const { setFcmDeviceToken, currentUser } = useAuthStore();
  const { isLoading, getNetworkStateAsync } = useAppState();
  const [internetAvailable, setInternetAvailable] = useState<boolean>(false);

  // Notifications

  const requestUserPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const permissionsAndroid = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return permissionsAndroid === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    }
  };
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const setupNotifications = async () => {
      const permission = await requestUserPermission();

      if (!permission) {
        toastResponseMessage({
          type: 'info',
          content: 'Please enable notifications to receive updates',
        });
        return;
      }

      try {
        const token = await messaging().getToken();
        setFcmDeviceToken(token);
      } catch (e) {
        setFcmDeviceToken(null);
        console.log('error', e);
      }

      ExpoNotifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      const messageSubscription = messaging().onMessage(async (message) => {
        console.log(message);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.refetchQueries({
          queryKey: ['notificationsCount'],
        });
      });

      const notificationSubscription = messaging().onNotificationOpenedApp(
        async (notification) => {
          console.log(notification);
          // Redirect to the notification page
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Notifications',
            })
          );
        }
      );
    };

    setupNotifications();

    // Clean up
    return () => {};
  }, [navigation, queryClient, setFcmDeviceToken]);

  const {
    playPause,
    resetPlayer,
    nextTrack,
    prevTrack,
    seek,
    seekForward,
    seekBackward,
  } = usePlayerStore();

  useEffect(() => {
    const setupPlayer = async () => {
      RNTrackPlayer.addEventListener(Event.RemotePlay, () => playPause(true));
      RNTrackPlayer.addEventListener(Event.RemotePause, () => playPause(false));
      RNTrackPlayer.addEventListener(Event.RemoteStop, () => resetPlayer());
      RNTrackPlayer.addEventListener(Event.RemoteNext, () => nextTrack());
      RNTrackPlayer.addEventListener(Event.RemotePrevious, () => prevTrack());
      RNTrackPlayer.addEventListener(Event.RemoteSeek, (data) =>
        seek(data.position)
      );
      RNTrackPlayer.addEventListener(Event.RemoteJumpForward, () =>
        seekForward(10)
      );
      RNTrackPlayer.addEventListener(Event.RemoteJumpBackward, () =>
        seekBackward(10)
      );
      RNTrackPlayer.addEventListener(Event.RemoteStop, () => resetPlayer());
      await RNTrackPlayer.setupPlayer({
        maxCacheSize: 1024 * 5, // 5 mb
      });

      await RNTrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        backwardJumpInterval: 10,
        forwardJumpInterval: 10,
        progressUpdateEventInterval: 2,
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.JumpForward,
          Capability.JumpBackward,
          Capability.Stop,
        ],
        capabilities: [
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.JumpForward,
          Capability.JumpBackward,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.SeekTo,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.JumpForward,
          Capability.JumpBackward,
          Capability.Stop,
        ],
      });
    };

    setupPlayer();
    getNetworkStateAsync().then((networkState) => {
      setInternetAvailable(networkState.isInternetReachable || false);
    });
  }, []);

  useEffect(() => {
    const subscribeLink = Linking.addEventListener('url', (event) => {
      console.log(event);
    });

    return () => {
      subscribeLink.remove();
    };
  }, [Linking]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen
              name="Settings"
              component={() => <></>}
              options={{
                headerShown: false,
              }}
            /> */}

      {/* No Auth Group */}
      {isLoading ? (
        <Stack.Screen
          name="Loading"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
          {currentUser || !internetAvailable ? (
            <>
              <Stack.Screen
                name="TabsLayout"
                component={TabsLayout}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="CreatePlaylist"
                component={CreatePlaylist}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  contentStyle: {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                  },
                }}
              />

              <Stack.Screen
                name="Notifications"
                component={Notifications}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />

              <Stack.Screen
                name="Membership"
                component={Membership}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />

              <Stack.Screen
                name="TrackPlayer"
                component={TrackPlayer}
                options={{
                  headerShown: false,
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="AddToPlaylist"
                component={AddToPlaylistSC1}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  header: () => (
                    <BackNavigator showBackText title="Add to Playlist" />
                  ),
                  contentStyle: {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                  },
                }}
              />

              <Stack.Screen
                name="UpdatePlaylist"
                component={UpdatePlaylist}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  contentStyle: {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                  },
                }}
              />
              <Stack.Screen
                name="UpdateAlbum"
                component={UpdateAlbum}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  contentStyle: {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                  },
                }}
              />

              <Stack.Screen
                name="FollowerFollowingTabs"
                component={FollowerFollowingTabs}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  contentStyle: {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'flex-end',
                    backgroundColor: COLORS.background.transparent(),
                  },
                }}
              />

              <Stack.Screen
                name="AlbumPage"
                component={AlbumPage}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
              <Stack.Screen
                name="ProfilePage"
                component={ProfilePage}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
            </>
          ) : (
            <Stack.Group
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
                name="ProfileSetup"
                component={ProfileSetup}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              />
            </Stack.Group>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}
