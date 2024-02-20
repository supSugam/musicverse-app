import COLORS from '@/constants/Colors';
import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import StyledText from './StyledText';

interface SwitchProps extends React.ComponentProps<typeof View> {
  value: boolean;
  onToggle: (value: boolean) => void;
  position?: 'left' | 'center' | 'right';
  label?: string | React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onToggle,
  position = 'end',
  label,
  ...rest
}) => {
  const translateX = useSharedValue(value ? 30 : 0);
  const scale = useSharedValue(1);

  const toggleSwitch = () => {
    onToggle(!value);
    translateX.value = withSpring(value ? 0 : 30, {
      damping: 15,
      stiffness: 120,
    });
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const switchContainerStyle = StyleSheet.flatten([
    styles.switchContainer,
    position === 'start' && styles.alignStart,
    position === 'center' && styles.alignBetween,
    label !== undefined && { marginLeft: 8 },
  ]);

  const leaveAnimation = () => {
    translateX.value = withTiming(0, { duration: 250 });
    scale.value = withTiming(1, { duration: 250 });
  };

  return (
    <TouchableWithoutFeedback
      onPress={toggleSwitch}
      onPressIn={() => (scale.value = withTiming(0.95, { duration: 500 }))}
      onPressOut={leaveAnimation}
    >
      <Animated.View
        {...rest}
        style={[styles.container, rest.style, scaleStyle]}
      >
        {label && (
          <>
            {typeof label === 'string' ? (
              <StyledText weight="semibold" size="lg">
                {label}
              </StyledText>
            ) : (
              label
            )}
          </>
        )}
        <View style={switchContainerStyle}>
          <LinearGradient
            colors={
              value
                ? [...COLORS.gradient.primary, COLORS.gradient.primary[0]]
                : [
                    COLORS.neutral.normal,
                    COLORS.neutral.light,
                    COLORS.neutral.white,
                  ]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.track}
          >
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </LinearGradient>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  switchContainer: {
    width: 68,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.neutral.light,
    alignSelf: 'flex-end',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignBetween: {
    alignItems: 'center',
  },
  track: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 16,
    backgroundColor: COLORS.neutral.white,
    elevation: 5,
  },
});

export default Switch;
