import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';
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
import { useEffect } from 'react';

const ToastInstance = () => {
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
  );
};

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
    zIndex: 999,
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

export default ToastInstance;
