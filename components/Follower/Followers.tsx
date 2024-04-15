import { FlatList } from 'react-native';
import React from 'react';
import ProfileName from '../Profile/ProfileName';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';

const Followers = ({ followers }: { followers: IUserWithProfile[] }) => {
  return (
    <FlatList
      data={followers}
      renderItem={({ item: follower }) => (
        <ProfileName
          key={follower.id}
          name={follower?.profile?.name}
          subtitle={follower.username}
          image={follower.profile?.avatar}
          id={follower.id}
          fullWidth
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Followers;
