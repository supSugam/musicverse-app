import { View, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import LogoWithName from '../reusables/LogoWithName';
import StyledText from '../reusables/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { Image } from 'expo-image';
import COLORS from '@/constants/Colors';
import { CommonActions, Link, useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import { useAppSidebar } from '../Sidebar/AppSidebar';
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';

const NavBar = ({ title = 'NavBar' }: { title?: string | React.ReactNode }) => {
  const { currentUserProfile, setCurrentUserProfile, api, isApiAuthorized } =
    useAuthStore((state) => state);
  const navigation = useNavigation();

  const {
    get: { data: profileData },
  } = useProfileQuery();

  useEffect(() => {
    setCurrentUserProfile(profileData?.data?.result || null);
  }, [profileData]);

  const { toggleAppSidebar } = useAppSidebar();

  const [notificationIcon, setNotificationIcon] = useState<
    'notifications-outline' | 'notifications'
  >('notifications-outline');

  const {
    data: notificationsCountData,
    isLoading,
    isRefetching,
  } = useQuery<AxiosResponse<SuccessResponse<number>>>({
    queryFn: async () => await api.get('/notifications/unread-count'),
    queryKey: ['notificationsCount'],
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    enabled: isApiAuthorized(),
  });

  const notificationCountWrapperRotation = useSharedValue(0);
  const notificationCountWrapperAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${notificationCountWrapperRotation.value}deg`,
      },
    ],
  }));
  const notificationCountScale = useSharedValue(0);
  const notificationCountAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: notificationCountScale.value,
      },
    ],
  }));
  const [unreadNotificationsCount, setUnreadNotificationsCount] =
    useState<number>(0);

  useEffect(() => {
    const updatedCount = notificationsCountData?.data.result || 0;
    if (unreadNotificationsCount !== updatedCount) {
      notificationCountWrapperRotation.value = withSequence(
        withTiming(30, { duration: 50 }),
        withTiming(-30, { duration: 50 }),
        withSpring(0, { damping: 10, stiffness: 500 })
      );
    }

    setUnreadNotificationsCount(updatedCount);
    notificationCountScale.value = withSpring(!!updatedCount ? 1 : 0, {
      damping: 20,
      stiffness: 100,
    });
  }, [notificationsCountData, isLoading, isRefetching]);
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
            typeof title === 'string' ? (
              <StyledText weight="extrabold" tracking="tight" size="2xl">
                {title}
              </StyledText>
            ) : (
              title
            )
          }
        />
        <View className="flex flex-row items-center">
          <AnimatedTouchable
            onPress={() =>
              navigation.dispatch(CommonActions.navigate('Notifications'))
            }
            onPressIn={() => setNotificationIcon('notifications')}
            onPressOut={() => setNotificationIcon('notifications-outline')}
            wrapperClassName="relative"
            wrapperStyles={{ marginRight: 20 }}
          >
            <Animated.View style={notificationCountWrapperAnimatedStyle}>
              <Ionicons name={notificationIcon} size={28} color="white" />
            </Animated.View>
            <Animated.View
              style={[
                notificationCountAnimatedStyle,
                {
                  width: 16,
                  height: 16,
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 99,
                },
              ]}
            >
              <View className="flex flex-row">
                <StyledText
                  size="xs"
                  weight="semibold"
                  tracking="tighter"
                  style={{
                    transform: [
                      {
                        scale: unreadNotificationsCount > 9 ? 1 : 0.8,
                      },
                      {
                        translateX: unreadNotificationsCount > 9 ? 2 : 0,
                      },
                    ],
                  }}
                >
                  {unreadNotificationsCount > 9 ? 9 : unreadNotificationsCount}
                </StyledText>

                {unreadNotificationsCount > 9 && (
                  <StyledText
                    size="xs"
                    weight="semibold"
                    tracking="tighter"
                    style={{
                      transform: [
                        {
                          scale: 0.75,
                        },
                        {
                          translateY: -5,
                        },
                      ],
                    }}
                  >
                    +
                  </StyledText>
                )}
              </View>

              <LinearGradient
                colors={COLORS.gradient.primary}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  zIndex: -1,
                  flex: 1,
                  top: 0,
                  left: 0,
                }}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
              />
            </Animated.View>
          </AnimatedTouchable>

          <AnimatedTouchable
            onPress={toggleAppSidebar}
            wrapperStyles={{
              borderColor: COLORS.neutral.normal,
              borderWidth: 1,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Image
              source={
                currentUserProfile?.avatar ||
                require('@/assets/images/avatar.jpeg')
              }
              style={{ width: 34, height: 34 }}
            />
          </AnimatedTouchable>
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
