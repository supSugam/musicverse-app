import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AppSidebarDrawer } from '@/components/Sidebar/AppSidebar';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import ToastInstance from '@/components/ToastInstance';
import LoadingModal from '@/components/global/LoadingModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { PermissionsAndroid, Platform } from 'react-native';
import { toastResponseMessage } from '@/utils/toast';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    ...FontAwesome.font,
    'InterTight-Regular': require('@/assets/fonts/InterTight-Regular.ttf'),
    'InterTight-Bold': require('@/assets/fonts/InterTight-Bold.ttf'),
    'InterTight-Black': require('@/assets/fonts/InterTight-Black.ttf'),
    'InterTight-ExtraBold': require('@/assets/fonts/InterTight-ExtraBold.ttf'),
    'InterTight-ExtraLight': require('@/assets/fonts/InterTight-ExtraLight.ttf'),
    'InterTight-Light': require('@/assets/fonts/InterTight-Light.ttf'),
    'InterTight-Medium': require('@/assets/fonts/InterTight-Medium.ttf'),
    'InterTight-SemiBold': require('@/assets/fonts/InterTight-SemiBold.ttf'),
    'InterTight-Thin': require('@/assets/fonts/InterTight-Thin.ttf'),
    'Oswald-Regular': require('@/assets/fonts/Oswald-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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
        console.log(token, 'TOKENNNNNN');
      } catch (e) {
        console.log('error', e);
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      const handleNotificationClick = async (response: any) => {
        const screen = response?.notification?.request?.content?.data?.screen;
        if (screen !== null) {
          // Assuming navigation is properly set up
          // navigation.navigate(screen);
        }
      };

      const notificationClickSubscription =
        Notifications.addNotificationResponseReceivedListener(
          handleNotificationClick
        );

      messaging().onNotificationOpenedApp((remoteMessage) => {
        if (remoteMessage?.data?.screen) {
          // navigation.navigate(`${remoteMessage.data.screen}`);
        }
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

        await Notifications.scheduleNotificationAsync({
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

        await Notifications.scheduleNotificationAsync({
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

  if (!fontsLoaded) {
    return <></>;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AppSidebarDrawer>
        <LoadingModal />
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
          </GestureHandlerRootView>

          <StatusBar style="light" translucent />
        </QueryClientProvider>
        <ToastInstance />
      </AppSidebarDrawer>
    </ThemeProvider>
  );
}
