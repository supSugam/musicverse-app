import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Welcome from './screens/get-started/Welcome';
import COLORS from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';
import Container from '@/components/Container';
import Register from './screens/get-started/Register';
import OTPVerification from './screens/get-started/OTPVerification';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

export default function index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { initialize } = useAuthStore((state) => state);

  const onInitialize = async () => {
    const loggedIn = await initialize();
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    onInitialize();
  }, []);
  return (
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
    </Stack.Navigator>
  );
}
