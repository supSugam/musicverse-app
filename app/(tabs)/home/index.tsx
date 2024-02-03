// app/tabs/home/HomeScreen.tsx
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen: React.FC = () => {
  const { currentUser } = useAuthStore((state) => state);
  return (
    <View>
      <Text>Welcome to the home screen {currentUser?.username}</Text>
    </View>
  );
};

export default HomeScreen;
