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
  State,
} from 'react-native-track-player';
import * as Linking from 'expo-linking';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import FollowerFollowingTabs from '@/components/Follower/FollowerFollowingTabs';
import ProfilePage from './(tabs)/profile';
import AlbumPage from './(tabs)/album';
import COLORS from '@/constants/Colors';
import Membership from '@/components/Membership/Membership';
import ResetPassword from '@/components/ResetPassword/ResetPassword';
import UpdateTrack from '@/components/Tracks/UpdateTrack';
import PlaylistPage from './(tabs)/playlist';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

import { createStackNavigator } from '@react-navigation/stack';
const RootStack = createStackNavigator();

const Stack = createNativeStackNavigator();

RNTrackPlayer.registerPlaybackService(() => require('./service'));

export default function index() {
  const { setFcmDeviceToken, currentUser, initialize } = useAuthStore();
  const { isLoading, getNetworkStateAsync, setIsLoading } = useAppState();
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
      console.log(permission, 'PERMISSION');

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
        console.log('FCM TOKEN', token);
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

      const handleNotificationClick = async (response: any) => {
        console.log('NOTIFICATION CLICK', response);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Notifications',
          })
        );
      };

      const notificationClickSubscription =
        ExpoNotifications.addNotificationResponseReceivedListener(
          handleNotificationClick
        );

      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('NOTIFICATION OPENED', remoteMessage);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Notifications',
          })
        );
      });

      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          console.log('INITIAL NOTIFICATION', remoteMessage);
          // if (remoteMessage && remoteMessage?.data?.screen) {
          //   // navigation.navigate(`${remoteMessage.data.screen}`);
          // }
        });

      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        const notification = {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data, // optional data payload
        };

        await ExpoNotifications.scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      });

      const handlePushNotification = async (remoteMessage: any) => {
        console.log('------ The app is running! ------');
        console.log('PUSH NOTIFICATION', remoteMessage);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.refetchQueries({
          queryKey: ['notificationsCount'],
        });
        const notification = {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data, // optional data payload
        };

        await ExpoNotifications.scheduleNotificationAsync({
          content: notification,
          trigger: null,
        });
      };

      const unsubscribe = messaging().onMessage(handlePushNotification);

      return () => {
        unsubscribe();
        notificationClickSubscription.remove();
      };
    };

    setIsLoading(true);
    initialize().finally(() => {
      setIsLoading(false);
      setupNotifications();

      return () => {};
    });
  }, [initialize]);

  const {
    playPause,
    resetPlayer,
    nextTrack,
    prevTrack,
    setCurrentTrackIndex,
    setIsPlaying,
    setPlaybackPosition,
  } = usePlayerStore();

  const setupPlayer = async () => {
    RNTrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      async ({ position }) => {
        setPlaybackPosition(position * 1000);
      }
    );
    RNTrackPlayer.addEventListener(Event.RemotePlay, () => playPause(true));
    RNTrackPlayer.addEventListener(Event.RemotePause, () => playPause(false));
    RNTrackPlayer.addEventListener(Event.RemoteStop, () => resetPlayer());
    RNTrackPlayer.addEventListener(Event.RemoteNext, () => nextTrack());
    RNTrackPlayer.addEventListener(Event.RemotePrevious, () => prevTrack());
    RNTrackPlayer.addEventListener(Event.RemoteSeek, (data) =>
      RNTrackPlayer.seekTo(data.position)
    );
    RNTrackPlayer.addEventListener(Event.RemoteJumpForward, () =>
      RNTrackPlayer.seekBy(10)
    );
    RNTrackPlayer.addEventListener(Event.RemoteJumpBackward, () =>
      RNTrackPlayer.seekBy(-10)
    );
    RNTrackPlayer.addEventListener(Event.RemoteStop, () => resetPlayer());
    await RNTrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 1024 * 1000,
    });

    RNTrackPlayer.addEventListener(Event.PlaybackState, ({ state }) => {
      setIsPlaying(
        state === State.Playing ||
          state === State.Buffering ||
          state === State.Loading
      );
    });
    RNTrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      ({ index }) => {
        if (index) setCurrentTrackIndex(index);
      }
    );

    await RNTrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      backwardJumpInterval: 10,
      forwardJumpInterval: 10,
      progressUpdateEventInterval: 1,
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

  useEffect(() => {
    setupPlayer().then(() => {
      console.log('RN Player Setup');
    });
    getNetworkStateAsync().then((networkState) => {
      setInternetAvailable(networkState.isInternetReachable || false);
    });
  }, []);

  useEffect(() => {
    const subscribeLink = Linking.addEventListener('url', (event) => {
      if (event.url === 'trackplayer://notification.click') {
        navigation.dispatch(CommonActions.navigate('TrackPlayer'));
      } else {
        navigation.dispatch(CommonActions.navigate('Notifications'));
      }
    });

    return () => {
      subscribeLink.remove();
    };
  }, [Linking]);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
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
                  animationDuration: 0,
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
                name="UpdateTrack"
                component={UpdateTrack}
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
                name="PlaylistPage"
                component={PlaylistPage}
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

      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
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
    </RootStack.Navigator>
  );
}
