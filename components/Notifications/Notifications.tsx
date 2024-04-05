import { View, Text, StyleSheet, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import BackNavigator from '../reusables/BackNavigator';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import COLORS from '@/constants/Colors';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { IBasePaginationParams } from '@/utils/Interfaces/IPagination';
import { NotificationType } from '@/utils/Interfaces/INotification';
import Animated from 'react-native-reanimated';
import { AxiosResponse } from 'axios';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';
import { clo } from '@/utils/helpers/Object';

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

  const { api } = useAuthStore();

  const { isLoading, isRefetching, data } = useQuery<
    AxiosResponse<SuccessResponse<any>>
  >({
    queryKey: ['notifications', notificationsQueryParams],
    queryFn: async () =>
      await api.get('/notifications', { params: notificationsQueryParams }),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    clo(data?.data?.result);
  }, [data]);
  return (
    <SafeAreaView style={styles.container}>
      <PrimaryGradient opacity={0.1} />
      <BackNavigator
        showBackText
        title="Notifications"
        backgroundColor={COLORS.neutral.dense}
        style={{
          borderColor: COLORS.neutral.dark,
          borderBottomWidth: 1,
        }}
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
