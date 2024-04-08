import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackNavigator from '../reusables/BackNavigator';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import COLORS from '@/constants/Colors';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import {
  INotification,
  NotificationType,
} from '@/utils/Interfaces/INotification';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { AxiosResponse } from 'axios';
import { PaginationResponse } from '@/utils/Interfaces/IApiResponse';
import NotificationCard from './NotificationCard';
import StyledText from '../reusables/StyledText';
import { capitalizeFirstLetter } from '@/utils/helpers/string';
import Capsule from '../reusables/Capsule';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import FadingDarkGradient from '../Playlist/FadingDarkGradient';

export interface INotificationsPaginationQueryParams
  extends IBasePaginationParams {
  read?: boolean;
  unread?: boolean;
  type?: NotificationType;
}

const Notifications = () => {
  useEffect(() => {
    setStatusBarBackgroundColor(COLORS.neutral.dense, true);
  }, []);

  const [notificationsQueryParams, setNotificationsQueryParams] =
    useState<INotificationsPaginationQueryParams>(
      {} as INotificationsPaginationQueryParams
    );

  // Get Notifications

  const [notifications, setNotifications] = useState<INotification[]>([]);

  const { api } = useAuthStore();

  const {
    isLoading,
    isRefetching,
    data,
    refetch: refetchNotifications,
  } = useQuery<AxiosResponse<PaginationResponse<INotification>, any>>({
    queryKey: ['notifications', notificationsQueryParams],
    queryFn: async () =>
      await api.get('/notifications', { params: notificationsQueryParams }),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    setNotifications(data?.data?.result?.items || []);
  }, [data]);

  const queryClient = useQueryClient();

  const { mutate: updateNotificationMutation } = useMutation({
    mutationFn: (notificationId: string) =>
      api.post(`/notifications/read/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', notificationsQueryParams],
      });
      queryClient.invalidateQueries({
        queryKey: ['notificationsCount'],
      });
    },
  });

  const onNotificationPress = (notification: INotification) => {
    updateNotificationMutation(notification.id);
  };

  const markAllasReadPositionY = useSharedValue(0);
  const markAllasReadAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: markAllasReadPositionY.value }],
    }),
    [markAllasReadPositionY]
  );

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => await api.post('/notifications/read'),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', notificationsQueryParams],
      });
      queryClient.refetchQueries({
        queryKey: ['notificationsCount'],
      });
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryGradient opacity={0.1} />
      <BackNavigator
        showBackText
        title="Notifications"
        backgroundColor={COLORS.neutral.dense}
        style={{
          borderColor: COLORS.neutral.semidark,
          borderBottomWidth: 1,
        }}
      />
      <View>
        <FlatList
          horizontal
          renderItem={({ item: type, index }) => {
            const isSelected = type === notificationsQueryParams.type;
            return (
              <Capsule
                key={type + index}
                text={capitalizeFirstLetter(type, true, '_')}
                selected={isSelected}
                onPress={() =>
                  setNotificationsQueryParams((prev) => ({
                    ...prev,
                    type: isSelected ? undefined : type,
                  }))
                }
              />
            );
          }}
          data={Object.values(NotificationType)}
          bounces
          alwaysBounceHorizontal
          contentContainerStyle={{
            marginVertical: 8,
          }}
        />
      </View>

      <FlatList
        alwaysBounceVertical
        renderItem={({ item, index }) => (
          <NotificationCard
            key={item.id + index}
            index={index}
            {...item}
            notificationDetails={item}
            onPress={() => onNotificationPress(item)}
          />
        )}
        data={notifications}
        bounces
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetchNotifications}
          />
        }
        onScroll={(e) => {
          markAllasReadPositionY.value = e.nativeEvent.contentOffset.y;
        }}
      />

      {/* Mark All as read */}
      <Animated.View
        className="absolute bottom-0 w-full h-16 flex"
        style={[
          markAllasReadAnimatedStyle,
          {
            backgroundColor: COLORS.neutral.semidark,
            borderTopWidth: 1,
            borderTopColor: COLORS.neutral.gray,
          },
        ]}
      >
        <AnimatedTouchable
          wrapperClassName="relative w-full h-full justify-center items-center"
          onPress={() => markAllAsReadMutation.mutate()}
        >
          <FadingDarkGradient opacity={0.5} />
          <StyledText size="xl" weight="bold">
            Mark all as read
          </StyledText>
        </AnimatedTouchable>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.neutral.dense,
  },
});

export default Notifications;
