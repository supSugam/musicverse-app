// app/(tabs)/_layout.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Home from './home';
// import Profile from './profile';
import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { toastResponseMessage } from '@/utils/toast';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const navigation = useNavigation();
  const { currentUser } = useAuthStore((state) => state);

  useEffect(() => {
    if (!currentUser) {
      toastResponseMessage({
        content: 'Please login to continue',
        type: 'error',
      });
    }
  }, [currentUser]);

  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
  });

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof (typeof Ionicons)['glyphMap'] = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={Home} />
        {/* <Tab.Screen name="Profile" component={Profile} /> */}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
