import { FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfileName from '../Profile/ProfileName';
import { useLocalSearchParams } from 'expo-router';
import { useFollowQuery } from '@/hooks/react-query/useFollowQuery';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';
import COLORS from '@/constants/Colors';
import { useQueryClient } from '@tanstack/react-query';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const Following = () => {
  const { userId } = useLocalSearchParams();
  const [following, setFollowing] = useState<IUserWithProfile[]>([]);
  const {
    getFollowing: { data: followingData },
    toggleFollow,
  } = useFollowQuery({
    usernameOrId: typeof userId === 'string' ? userId : undefined,
  });

  useEffect(() => {
    setFollowing(followingData?.data?.result?.items || []);
  }, [followingData]);

  const queryClient = useQueryClient();

  const onRightComponentPress = async (id: string) => {
    setFollowing((prev) =>
      prev.map((following) => {
        if (following.id === id) {
          return {
            ...following,
            isFollowing: !following.isFollowing,
          };
        }
        return following;
      })
    );
    toggleFollow.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['following'],
        });
      },
    });
  };
  return (
    <FlatList
      data={following}
      renderItem={({ item: following, index }) => (
        <ProfileName
          index={index}
          key={following.id}
          name={`${following?.profile?.name} ${following.isMe ? '(You)' : ''}`}
          subtitle={`${following._count?.followers} followers`}
          image={following.profile?.avatar}
          id={following.id}
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
              onPress={() => onRightComponentPress(following.id)}
            >
              <Ionicons
                name={following.isFollowing ? 'checkmark' : 'person-add'}
                size={24}
                color={
                  following.isFollowing
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

export default Following;
