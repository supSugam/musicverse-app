import { View, Text } from 'react-native';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import COLORS from '@/constants/Colors';
import StyledText from '../reusables/StyledText';
import { useEffect, useState } from 'react';

interface IFollowButtonProps {
  onPress: () => void;
  isFollowing?: boolean;
}
const FollowButton = ({ isFollowing = false, onPress }: IFollowButtonProps) => {
  const [following, setFollowing] = useState<boolean>(isFollowing);

  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  return (
    <AnimatedTouchable
      wrapperStyles={{
        paddingVertical: 5,
        paddingHorizontal: 24,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.neutral.light,
        borderWidth: 1,
        flexShrink: 1,
      }}
      activeOpacity={0.85}
      onPress={() => {
        setFollowing((prev) => !prev);
        onPress();
      }}
    >
      <StyledText size="base" weight="semibold" color={COLORS.neutral.light}>
        {following ? 'Following' : 'Follow'}
      </StyledText>
    </AnimatedTouchable>
  );
};

export default FollowButton;
