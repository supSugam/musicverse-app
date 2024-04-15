import { FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfileName from '../Profile/ProfileName';
import { useLocalSearchParams } from 'expo-router';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import COLORS from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';

const Followers = () => {
  const { userId } = useLocalSearchParams();
  const [followers, setFollowers] = useState<IUserWithProfile[]>([]);
  const {
    getFollowers: { data: followersData },
    toggleFollow,
  } = useFollowQuery({
    usernameOrId: typeof userId === 'string' ? userId : undefined,
  });

  useEffect(() => {
    setFollowers(followersData?.data?.result?.items || []);
  }, [followersData]);

  const queryClient = useQueryClient();

  const onRightComponentPress = async (id: string) => {
    setFollowers((prev) =>
      prev.map((follower) => {
        if (follower.id === id) {
          return {
            ...follower,
            isFollowing: !follower.isFollowing,
          };
        }
        return follower;
      })
    );
    toggleFollow.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['followers'],
        });
      },
    });
  };
  return (
    <FlatList
      data={[
        ...followers,
        ...followers,
        ...followers,
        ...followers,
        ...followers,
        ...followers,
        ...followers,
        ...followers,
        ...followers,
      ]}
      renderItem={({ item: follower, index }) => (
        <ProfileName
          index={index}
          id={follower.id}
          key={`${follower.id}-${index}-follower`}
          name={`${follower?.profile?.name} ${follower.isMe ? '(You)' : ''}`}
          subtitle={`${follower._count?.followers} followers`}
          image={follower.profile?.avatar}
          fullWidth
          className="px-2 py-3"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.neutral.semidark,
          }}
          rightComponent={
            <TouchableOpacity
              activeOpacity={0.8}
              className="mr-2"
              onPress={() => onRightComponentPress(follower.id)}
            >
              <Ionicons
                name={follower.isFollowing ? 'checkmark' : 'person-add'}
                size={24}
                color={
                  follower.isFollowing
                    ? COLORS.primary.light
                    : COLORS.neutral.normal
                }
              />
            </TouchableOpacity>
          }
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Followers;
