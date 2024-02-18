import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import COLORS from '@/constants/Colors';
import StyledText from './StyledText';

interface ProgressBarProps extends React.ComponentProps<typeof View> {
  progress: number;
  showCaption?: boolean;
  caption?: string;
  showProgressPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showCaption = false,
  caption = 'Progress',
  showProgressPercentage = false,
  ...rest
}) => {
  const progressValue = useSharedValue(0);

  // Update progress value with smooth animation
  React.useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 800,
      easing: Easing.bezier(0.22, 1, 0.36, 1), // Easing curve for smoother animation
    });
  }, [progress]);

  // Animated styles for the progress bar
  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  return (
    <View style={[styles.container, rest.style]} {...rest}>
      <View style={styles.captionContainer}>
        {showCaption && (
          <StyledText size="lg" weight="semibold">
            {caption} {showProgressPercentage && `(${progress}%)`}
          </StyledText>
        )}
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.track]}>
          <Animated.View style={[styles.progress, progressBarStyle]}>
            <LinearGradient
              colors={COLORS.gradient.primary} // Using primary gradient colors for the progress bar
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.track]}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.neutral.dark, // Background color
    borderRadius: 8, // Add border radius for a rounded appearance
  },
  captionContainer: {
    marginBottom: 8, // Adjust margin for spacing
  },
  progressBar: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Add border for glow effect
  },
  track: {
    flex: 1,
    borderRadius: 5,
    color: COLORS.neutral.normal,
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar;
