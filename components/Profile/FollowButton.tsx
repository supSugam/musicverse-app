import AnimatedTouchable from '../reusables/AnimatedTouchable';
import COLORS from '@/constants/Colors';
import StyledText from '../reusables/StyledText';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { toastResponseMessage } from '@/utils/toast';

interface IFollowButtonProps {
  onPress: () => void;
  isFollowing?: boolean;
  id?: string;
}
const FollowButton = ({
  isFollowing = false,
  onPress,
  id,
}: IFollowButtonProps) => {
  const [following, setFollowing] = useState<boolean>(isFollowing);
  const { currentUser } = useAuthStore();
  useEffect(() => {
    setFollowing(isFollowing);
  }, [isFollowing]);

  return (
    <AnimatedTouchable
      wrapperStyles={{
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.neutral.normal,
        borderWidth: 1,
        flexShrink: 1,
      }}
      activeOpacity={0.85}
      onPress={() => {
        if (currentUser?.id === id) {
          toastResponseMessage({
            type: 'error',
            content: 'You cannot follow yourself!',
          });
          return;
        }
        setFollowing((prev) => !prev);
        onPress();
      }}
    >
      <StyledText size="sm" weight="semibold" color={COLORS.neutral.normal}>
        {following ? 'Following' : 'Follow'}
      </StyledText>
    </AnimatedTouchable>
  );
};

export default FollowButton;
