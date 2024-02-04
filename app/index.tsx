import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Welcome from './screens/get-started/Welcome';
import COLORS from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import Container from '@/components/Container';
import Register from './screens/get-started/Register';
import OTPVerification from './screens/get-started/OTPVerification';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useEffect, useState } from 'react';
import TabsLayout from './(tabs)/_layout';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

export default function index() {
  const { currentUser, initialize } = useAuthStore((state) => state);

  useEffect(() => {
    const onInitialize = async () => {
      await initialize();
    };

    onInitialize();
  }, [initialize]);

  return (
    <>
      {currentUser !== null ? (
        <TabsLayout />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true,
          }}
        >
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="OTPVerification"
            component={OTPVerification}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </>
  );
}
