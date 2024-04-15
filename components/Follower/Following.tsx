import { FlatList } from 'react-native';
import React from 'react';
import ProfileName from '../Profile/ProfileName';
import { IUserWithProfile } from '@/utils/Interfaces/IUser';

const Following = ({ following }: { following: IUserWithProfile[] }) => {
  return (
    <FlatList
      data={following}
      renderItem={({ item: following }) => (
        <ProfileName
          key={following.id}
          name={following?.profile?.name}
          subtitle={following.username}
          image={following.profile?.avatar}
          id={following.id}
          fullWidth
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default Following;
