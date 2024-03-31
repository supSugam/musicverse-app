import { View } from 'react-native';
import React from 'react';
import {
  RecentSearch,
  useAppState,
} from '@/services/zustand/stores/useAppStore';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import ImageDisplay from '../reusables/ImageDisplay';
import { TRACK_PLACEHOLDER_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

interface IRecentSearchProps {
  recentSearch: RecentSearch;
}
const RecentSearchCard = ({ recentSearch }: IRecentSearchProps) => {
  const { removeRecentSearch } = useAppState();

  const details = {} as {
    title: string;
    subtitle: string;
    image: string | null;
    roundedImage: boolean;
  };

  details['subtitle'] = recentSearch.type;
  if (recentSearch.type === 'User') {
    details['title'] =
      recentSearch.data.profile?.name || recentSearch.data.username || '';
    details['roundedImage'] = true;
  } else if (recentSearch.type === 'Artist') {
    details['title'] =
      recentSearch.data.profile?.name || recentSearch.data.username || '';
    details['roundedImage'] = true;
  } else {
    details['title'] = recentSearch.data.title;
    details['subtitle'] = `${recentSearch.type} • ${
      recentSearch.data.creator?.profile?.name ||
      recentSearch.data.creator?.username ||
      ''
    }`;
    details['image'] = recentSearch.data.cover;
  }

  return (
    <AnimatedTouchable
      className="flex flex-row items-center my-1 px-2 py-3 w-full"
      style={{
        borderRadius: 5,
        borderColor: COLORS.neutral.semidark,
        backgroundColor: 'red',
        flexDirection: 'row',
      }}
    >
      <ImageDisplay
        source={{ uri: details.image || TRACK_PLACEHOLDER_IMAGE }}
        height={60}
        width={60}
        borderRadius={details.roundedImage ? 'full' : 8}
      />
      <View
        className="flex flex-row w-full"
        style={{
          backgroundColor: 'green',
        }}
      >
        <View className="flex flex-col flex-1">
          <StyledText weight="semibold" numberOfLines={1} ellipsizeMode="tail">
            {details.title}
          </StyledText>
          <StyledText
            weight="medium"
            opacity="high"
            numberOfLines={1}
            ellipsizeMode="tail"
            className="mt-1"
          >
            {details.subtitle}
          </StyledText>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => removeRecentSearch(recentSearch.data.id)}
        >
          <MaterialIcons size={24} name="close" color={COLORS.neutral.light} />
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
};

export default RecentSearchCard;
