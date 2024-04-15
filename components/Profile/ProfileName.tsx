import React, { useEffect } from 'react';
import { UserRole } from '@/utils/Interfaces/IUser';
import ImageDisplay from '../reusables/ImageDisplay';
import StyledText from '../reusables/StyledText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import COLORS from '@/constants/Colors';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface IProfileNameProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  name?: string;
  subtitle?: string;
  image?: string | null;
  isVerified?: boolean;
  userRole?: UserRole;
  id?: string;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  rightComponent?: React.ReactNode;
  index?: number;
}
const ProfileName = ({
  name,
  subtitle,
  image,
  isVerified,
  userRole = UserRole.USER,
  id,
  width = 40,
  height = 40,
  fullWidth = false,
  rightComponent,
  index,
  ...rest
}: IProfileNameProps) => {
  const navigation = useNavigation();
  const { className, ...others } = rest;

  const onPress = () => {
    if (!id) return;
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ProfilePage',
        params: {
          username: id,
        },
      })
    );
  };

  const translateX = useSharedValue(100);
  const opacity = useSharedValue(0);
  const profileNameAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    translateX.value = withDelay(
      (index ? index + 1 : 1) * 100,
      withTiming(0, { duration: 500 })
    );
    opacity.value = withDelay(
      (index ? index + 1 : 1) * 100,
      withTiming(1, { duration: 500 })
    );
  }, [index]);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[fullWidth && { width: '100%' }]}
      {...others}
    >
      <Animated.View
        className={`w-full flex flex-row items-center justify-between ${className}`}
        style={[!!index && profileNameAnimatedStyle]}
      >
        <View className="flex flex-row items-center">
          <ImageDisplay
            source={image}
            width={width}
            height={height}
            bordered
            borderRadius="full"
          />
          <View className="flex flex-col ml-3">
            <StyledText
              size="base"
              weight="semibold"
              tracking="tight"
              color={COLORS.neutral.light}
            >
              {name}
            </StyledText>
            {subtitle && (
              <StyledText
                size="sm"
                opacity="high"
                color={COLORS.neutral.light}
                tracking="tight"
                weight="medium"
              >
                {subtitle}
              </StyledText>
            )}
          </View>
        </View>
        {rightComponent}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ProfileName;
