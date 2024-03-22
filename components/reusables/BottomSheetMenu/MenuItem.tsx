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
  borderTop?: boolean;
  borderBottom?: boolean;
}

const MenuItem = ({
  onPress,
  icon,
  label,
  rightComponent,
  duration,
  borderBottom = false,
  borderTop = false,
  ...rest
}: IMenuItemProps) => {
  const translateX = useSharedValue(100);
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
      onPressIn={() => (scale.value = withTiming(0.95, { duration: 200 }))}
      onPressOut={leaveAnimation}
    >
      <Animated.View
        style={[
          styles.wrapper,
          rest.style,
          scaleStyle,
          translateStyle,
          borderTop && styles.borderTop,
          borderBottom && styles.borderBottom,
        ]}
      >
        <View className="flex-row items-center flex-1">
          {icon && (
            <MaterialIcons
              name={icon}
              size={28}
              color={COLORS.neutral.normal}
              style={{ marginRight: 10 }}
            />
          )}
          <StyledText
            numberOfLines={1}
            ellipsizeMode="tail"
            weight="normal"
            size="lg"
          >
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
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    padding: 16,
    borderColor: COLORS.neutral.gray,
  },
  borderTop: {
    borderTopWidth: 0.5,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
  },
});

export default MenuItem;
