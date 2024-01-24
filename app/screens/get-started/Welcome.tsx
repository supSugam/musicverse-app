import StyledText from '@/components/reusables/StyledText';
import FloatingWrapper from '@/components/reusables/FloatingWrapper';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import { GirlListeningLA } from '@/assets/lottie';
import useScreenDimensions from '@/hooks/useScreenDimensions';

export default function Welcome() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useScreenDimensions();
  return (
    <LinearGradient
      colors={[COLORS.background.dark, COLORS.background.dense]}
      className="flex-1"
    >
      <View className="flex-1 flex-col justify-center items-center p-8">
        <LottieView
          source={GirlListeningLA}
          autoPlay
          loop
          speed={0.25}
          style={{
            width: SCREEN_WIDTH * 0.75,
            height: SCREEN_HEIGHT * 0.25,
            alignSelf: 'center',
            transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
          }}
        />
        <FloatingWrapper>
          <StyledText size="xl" tracking="tighter" weight="bold">
            Welcome
          </StyledText>
        </FloatingWrapper>
      </View>
    </LinearGradient>
  );
}
