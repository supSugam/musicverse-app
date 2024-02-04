import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Home from './home';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'MyLibrary') {
            iconName = focused ? 'library' : 'library-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={focused ? COLORS.neutral.white : COLORS.neutral.normal}
            />
          );
        },
        tabBarLabel: ({ focused, color }) => {
          const routeName = route.name as string;
          return (
            <StyledText
              size="xs"
              tracking="tight"
              weight={focused ? 'bold' : 'normal'}
              dimness={focused ? 'none' : 'extra'}
              style={{
                color: focused ? COLORS.neutral.light : COLORS.neutral.normal,
              }}
            >
              {routeName}
            </StyledText>
          );
        },
        headerShown: Platform.OS === 'ios' ? true : false,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarOptions: {
          tabBarPosition: 'bottom',
          swipeEnabled: true,
          animationEnabled: true,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.05)',
              'rgba(0, 0, 0, 0.1)',
              'rgba(0, 0, 0, 0.2)',
              'rgba(0, 0, 0, 0.25)',
              'rgba(0, 0, 0, 0.3)',
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
              right: 0,
              top: 0,
              height: '100%',
              flex: 1,
              zIndex: -1,
            }}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: 'Home',
        }}
      />
      <Tab.Screen
        name="Search"
        component={Home}
        options={{
          headerTitle: 'Home',
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          headerTitle: 'Home',
        }}
      />

      <Tab.Screen
        name="MyLibrary"
        component={Home}
        options={{
          headerTitle: 'Home',
        }}
      />
    </Tab.Navigator>
  );
}
