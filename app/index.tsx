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

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
const Stack = createNativeStackNavigator();

export default function index() {
  const { currentUser, initialize } = useAuthStore();
  useEffect(() => {
    const onInitialize = async () => {
      await initialize();
    };
    onInitialize();
  }, [initialize]);

  const { setFcmDeviceToken } = useAuthStore();

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
        navigation.dispatch(CommonActions.navigate('Notifications', {}));
        queryClient.invalidateQueries({ queryKey: ['notificationsCount'] });
        // const screen = response?.notification?.request?.content?.data?.screen;
        // if (screen !== null) {
        //   // Assuming navigation is properly set up
        //   // navigation.navigate(screen);
        // }
      };

      const notificationClickSubscription =
        ExpoNotifications.addNotificationResponseReceivedListener(
          handleNotificationClick
        );

      messaging().onNotificationOpenedApp((remoteMessage) => {
        if (remoteMessage?.data?.screen) {
          // navigation.navigate(`${remoteMessage.data.screen}`);
        }
        navigation.dispatch(CommonActions.navigate('Notifications', {}));
      });

      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage && remoteMessage?.data?.screen) {
            // navigation.navigate(`${remoteMessage.data.screen}`);
          }
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

    setupNotifications();

    // Clean up
    return () => {};
  }, []);

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
              name="TabsLayout"
              component={TabsLayout}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Notifications"
              component={Notifications}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 100,
              }}
            />

            {/* <Stack.Screen
              name="Settings"
              component={() => <></>}
              options={{
                headerShown: false,
              }}
            /> */}

            <Stack.Group
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: `rgba(0,0,0,0.5)`,
                  justifyContent: 'flex-end',
                },
              }}
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
              <Stack.Screen
                name="UpdatePlaylist"
                component={UpdatePlaylist}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
                  animationDuration: 200,
                }}
              />
              <Stack.Screen
                name="UpdateAlbum"
                component={UpdateAlbum}
                options={{
                  presentation: 'transparentModal',
                  animation: 'slide_from_bottom',
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
          initialRouteName="Welcome"
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
        </Stack.Navigator>
      )}
    </>
  );
}
