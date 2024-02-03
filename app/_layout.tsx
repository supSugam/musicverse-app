import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import StyledText from '@/components/reusables/StyledText';
import useScreenDimensions from '@/hooks/useScreenDimensions';

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
  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);
  const { SCREEN_WIDTH } = useScreenDimensions();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20 });
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <StatusBar style="light" />
      </QueryClientProvider>
      <Toast
        position="top"
        config={{
          success: ({ text1, text2, ...rest }) => (
            <Animated.View
              style={[
                styles.container,
                animatedStyle,
                { maxWidth: SCREEN_WIDTH - 32 },
              ]}
            >
              <View style={styles.circle}>
                <FontAwesome name="check" size={20} color="#fff" solid />
              </View>
              <StyledText
                size="lg"
                tracking="tighter"
                weight="semibold"
                className="text-ellipsis leading-tighter"
              >
                {text1 || text2 || 'No Message was passed.'}
              </StyledText>
            </Animated.View>
          ),
          error: ({ text1, text2, ...rest }) => (
            <Animated.View
              style={[
                styles.container,
                animatedStyle,
                { maxWidth: SCREEN_WIDTH - 32 },
              ]}
            >
              <View style={[styles.circle, styles.circleRed]}>
                <FontAwesome name="times" size={20} color="#fff" solid />
              </View>
              <StyledText
                size="lg"
                tracking="tighter"
                weight="semibold"
                className="text-ellipsis line-clamp-1 leading-tighter"
              >
                {text1 || text2 || 'No Message was passed.'}
              </StyledText>
            </Animated.View>
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    color: '#fff',
    lineHeight: 1,
    elevation: 5,
    margin: 16,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  circle: {
    borderColor: '#e0e0e0',
    borderRightColor: '#616161',
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#61d345', // Green circle background color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 'auto',
    marginTop: 4,
  },
  circleRed: {
    backgroundColor: '#d34545', // Green circle background color
  },
  message: {
    flex: 1,
    justifyContent: 'center',
  },
});
