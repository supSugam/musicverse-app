import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import React, { useEffect } from 'react';
import LogoWithName from '../reusables/LogoWithName';
import StyledText from '../reusables/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { Image } from 'expo-image';
import COLORS from '@/constants/Colors';
import { toastResponseMessage } from '@/utils/toast';
import { IUserProfile } from '@/utils/Interfaces/IUser';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
import { Link } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const NavBar = ({ title = 'NavBar' }: { title?: string }) => {
  const { setCurrentUserProfile, currentUserProfile, logout, api } =
    useAuthStore((state) => state);

  const { data: profile } = useProfileQuery().get;

  useEffect(() => {
    if (profile) {
      setCurrentUserProfile(profile.data.result as IUserProfile);
    }
  }, [profile]);

  const navigation = useNavigation();
  const currentRouteName =
    navigation.getState().routes[navigation.getState().index].name;
  return (
    <View
      style={{
        height: 65,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral.dark,
        shadowColor: COLORS.primary.light,
        shadowOffset: { width: 0, height: 100 },
        shadowOpacity: 0.6,
        shadowRadius: 50,
        elevation: 100,
      }}
      className="relative"
    >
      <View
        className="flex flex-row items-center"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          zIndex: 2,
          marginHorizontal: 10,
        }}
      >
        <LogoWithName
          width={44}
          height={44}
          title={
            <StyledText weight="extrabold" tracking="tight" size="2xl">
              {title}
            </StyledText>
          }
        />
        <View className="flex flex-row items-center">
          <Ionicons
            name="notifications"
            size={24}
            color="white"
            style={{ marginRight: 12 }}
          />

          <Pressable onPress={logout}>
            <Image
              source={
                currentUserProfile?.avatar ||
                require('@/assets/images/avatar.jpeg')
              }
              style={{ width: 34, height: 34, borderRadius: 20 }}
            />
          </Pressable>
        </View>
      </View>
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.35)',
          'rgba(0, 0, 0, 0.5)',
          'rgba(0, 0, 0, 0.7)',
          'rgba(0, 0, 0, 0.8)',
          'rgba(0, 0, 0, 0.9)',
        ]}
        start={[0, 0]}
        end={[0, 1]}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
        }}
      />
    </View>
  );
};

export default NavBar;
