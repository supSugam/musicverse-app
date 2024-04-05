import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  RefreshControl,
} from 'react-native';
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
import Animated from 'react-native-reanimated';
import { AxiosResponse } from 'axios';
import { PaginationResponse } from '@/utils/Interfaces/IApiResponse';
import { clo } from '@/utils/helpers/Object';
import NotificationCard from './NotificationCard';

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

  const { mutateAsync: updateNotificationMutation } = useMutation({
    mutationFn: async (notificationId: string) =>
      await api.post(`/notifications/unread/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', notificationsQueryParams],
      });
    },
  });

  const onNotificationPress = async (notification: INotification) => {
    await updateNotificationMutation(notification.id);
  };
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

      <FlatList
        renderItem={({ item, index }) => (
          <NotificationCard
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
      />
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
