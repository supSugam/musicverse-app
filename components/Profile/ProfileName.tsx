import React from 'react';
import { UserRole } from '@/utils/Interfaces/IUser';
import ImageDisplay from '../reusables/ImageDisplay';
import StyledText from '../reusables/StyledText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import COLORS from '@/constants/Colors';
import { View } from 'react-native';

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
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`flex flex-row items-center justify-between ${className}`}
      style={[fullWidth && { width: '100%' }]}
      {...others}
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
    </TouchableOpacity>
  );
};

export default ProfileName;
