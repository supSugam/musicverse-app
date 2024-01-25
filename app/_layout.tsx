import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
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

  if (!fontsLoaded) {
    return <></>;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <StatusBar style="light" />
    </>
  );
}
