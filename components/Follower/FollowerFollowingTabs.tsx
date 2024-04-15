import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Followers from './Followers';
import Following from './Following';
import COLORS from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';

const Tab = createMaterialTopTabNavigator();

function FollowerFollowingTabs() {
  const { userId } = useLocalSearchParams();
  return (
    <View style={styles.modalContainer}>
      <Tab.Navigator
        initialRouteName="Followers"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarBounces: true,
          lazy: true,
        }}
      >
        <Tab.Screen
          name="Followers"
          component={Followers}
          options={{
            tabBarLabel: 'Followers',
          }}
          initialParams={userId ? { userId } : {}}
        />
        <Tab.Screen
          name="Following"
          component={Following}
          options={{
            tabBarLabel: 'Following',
          }}
          initialParams={userId ? { userId } : {}}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.neutral.semidark,
    borderRadius: 16,
    maxHeight: '70%',
    minHeight: '40%',
    justifyContent: 'center',
    display: 'flex',
  },
});

export default FollowerFollowingTabs;
