import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Followers from './Followers';
import Following from './Following';
import COLORS from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';

const Tab = createMaterialTopTabNavigator();

function FollowerFollowingTabs() {
  const { userId } = useLocalSearchParams();
  const [followers, setFollowers] = useState<IUserWithProfile[]>([]);
  const [following, setFollowing] = useState<IUserWithProfile[]>([]);

  const {
    getFollowers: { data: followersData },

    getFollowing: { data: followingData },
  } = useFollowQuery({
    usernameOrId: !!userId
      ? userId instanceof Array
        ? undefined
        : userId
      : undefined,
  });

  useEffect(() => {
    setFollowers(followersData?.data?.result?.items || []);
  }, [followersData]);

  useEffect(() => {
    setFollowing(followingData?.data?.result?.items || []);
  }, [followingData]);

  return (
    <View style={styles.modalContainer}>
      <Tab.Navigator
        initialRouteName="Followers"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarBounces: true,
        }}
      >
        <Tab.Screen
          name="Followers"
          component={() => <Followers followers={followers} />}
          options={{
            tabBarLabel: 'Followers',
          }}
        />
        <Tab.Screen
          name="Following"
          component={() => <Following following={following} />}
          options={{
            tabBarLabel: 'Following',
          }}
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
