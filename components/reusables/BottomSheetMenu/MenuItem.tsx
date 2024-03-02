import { View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '../StyledText';
import COLORS from '@/constants/Colors';

export interface IMenuItemProps extends React.ComponentProps<typeof View> {
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  label?: string;
  rightComponent?: React.ReactNode;
  duration?: number;
}

const MenuItem = ({
  onPress,
  icon,
  label,
  rightComponent,
  duration,
  ...rest
}: IMenuItemProps) => {
  const translateX = useSharedValue(50); // Start position outside the screen
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  useEffect(() => {
    translateX.value = withTiming(0, { duration });
  }, []);
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const leaveAnimation = () => {
    scale.value = withTiming(1, { duration: 250 });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(0.95, { duration: 500 }))}
      onPressOut={leaveAnimation}
    >
      <Animated.View
        {...rest}
        style={[styles.wrapper, rest.style, scaleStyle, translateStyle]}
      >
        <View className="flex-row items-center flex-1">
          {icon && (
            <MaterialIcons
              name={icon}
              size={28}
              color={COLORS.neutral.normal}
              style={{ marginRight: 8 }}
            />
          )}
          <StyledText weight="normal" size="lg">
            {label}
          </StyledText>
        </View>
        <View className="ml-auto">{rightComponent}</View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    padding: 16,
    borderBottomColor: COLORS.neutral.semidark,
    borderBottomWidth: 1,
  },
});

export default MenuItem;
