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
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';

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
      wrapperStyles={{
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        marginVertical: 2,
        height: 75,
        position: 'relative',
        maxWidth: '100%',
      }}
    >
      <PrimaryGradient opacity={0.1} />
      <ImageDisplay
        source={{ uri: details.image || TRACK_PLACEHOLDER_IMAGE }}
        height={56}
        width={56}
        borderRadius={details.roundedImage ? 'full' : 8}
        className="ml-3"
      />
      <View className="flex flex-row ml-4 justify-between flex-1">
        <View className="flex flex-col">
          <StyledText weight="semibold" numberOfLines={1} ellipsizeMode="tail">
            {details.title}
          </StyledText>
          <StyledText
            weight="medium"
            numberOfLines={1}
            ellipsizeMode="tail"
            color={COLORS.neutral.light}
          >
            {details.subtitle}
          </StyledText>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => removeRecentSearch(recentSearch.data.id)}
          containerStyle={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <MaterialIcons size={28} name="close" color={COLORS.neutral.light} />
        </TouchableOpacity>
      </View>
    </AnimatedTouchable>
  );
};

export default RecentSearchCard;
