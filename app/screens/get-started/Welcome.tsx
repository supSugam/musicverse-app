import React from 'react';
import StyledText from '@/components/reusables/StyledText';
import COLORS from '@/constants/Colors';
import { View, TouchableOpacity } from 'react-native'; // Import TouchableOpacity for the button
import LottieView from 'lottie-react-native';
import { GirlListeningLA } from '@/assets/lottie';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import Container from '@/components/Container';
import { StyledButton } from '@/components/reusables/StyledButton';
import { useAppState } from '@/services/zustand/stores/useAppStore';
import * as Clipboard from 'expo-clipboard';

export default function Welcome({ navigation }: { navigation: any }) {
  const { SCREEN_WIDTH, SCREEN_HEIGHT } = useScreenDimensions();

  const navigateToRegistrationScreen = () => {
    navigation.navigate('Register');
  };

  const { fcmDeviceToken } = useAppState();

  return (
    <Container>
      <View className="flex-1 flex-col justify-center items-center p-8 pb-16">
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

        <View className="flex flex-col justify-center items-center my-16">
          <StyledText
            size="base"
            tracking="widest"
            weight="medium"
            uppercase
            className="my-2 text-violet-300"
          >
            Welcome to
          </StyledText>
          <StyledText
            size="4xl"
            tracking="tighter"
            weight="bold"
            className="my-2"
          >
            MusicVerse
          </StyledText>
          <StyledText
            size="base"
            weight="normal"
            className="mt-4 text-slate-200 text-center"
          >
            Discover, share, and tune into MusicVerse. Your one-stop for musical
            bliss. Get started now, and let the beats begin!
          </StyledText>
          <StyledText
            onPress={async () => {
              await Clipboard.setStringAsync(
                fcmDeviceToken || 'Token Not Available'
              );
            }}
          >
            Your FCM Device Token is: {fcmDeviceToken || 'Not available'}
          </StyledText>
        </View>

        {/* Add a button to navigate to the Explore screen */}
        <StyledButton fullWidth onPress={navigateToRegistrationScreen}>
          <StyledText size="xl" weight="semibold" tracking="tighter">
            Get Started
          </StyledText>
        </StyledButton>
      </View>
    </Container>
  );
}
