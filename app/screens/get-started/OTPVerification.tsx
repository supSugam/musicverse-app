import { useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { KeyboardAvoidingView, View, ScrollView } from 'react-native'; // Import TouchableOpacity for the button
import Container from '@/components/Container';
import StyledButton from '@/components/reusables/StyledButton';
import StyledTextField from '@/components/reusables/StyledTextField';
import { Image } from 'expo-image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Platform } from 'react-native';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import LogoWithName from '@/components/reusables/LogoWithName';
import PinCodeInput from '@/components/PinCodeInput';
import LottieView from 'lottie-react-native';
import { WaitingForCodeLA } from '@/assets/lottie';

export default function Register({ navigation }: { navigation: any }) {
  const navigateToRegistrationScreen = () => {
    navigation.navigate('Register');
  };
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useScreenDimensions();

  const [loading, setLoading] = useState<boolean>(false);

  const [otpCode, setOtpCode] = useState<string>('');
  const { height } = useScreenDimensions();

  return (
    <Container>
      <View
        style={{
          minHeight: height,
        }}
        className="flex-1 h-full flex-col justify-end items-center p-8 py-16 pt-24 mt-auto"
      >
        <LogoWithName discludeName />

        <LottieView
          source={WaitingForCodeLA}
          autoPlay
          // loop={false}
          loop
          speed={0.25}
          style={{
            width: SCREEN_WIDTH * 0.65,
            height: SCREEN_HEIGHT * 0.25,
            alignSelf: 'center',
            transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
            marginTop: 48,
          }}
        />

        <View className="flex flex-col w-full">
          <PinCodeInput
            onChange={(value) => {
              setOtpCode(value);
              console.log(value);
            }}
            value={otpCode}
            length={6}
          />
        </View>

        <View className="flex mt-auto mb-4 flex-col w-full">
          <StyledButton
            fullWidth
            variant="secondary"
            onPress={navigateToRegistrationScreen}
            className="mb-4"
          >
            <StyledText
              weight="semibold"
              size="base"
              className="text-white"
              uppercase
            >
              Resend Code
            </StyledText>
          </StyledButton>

          <StyledButton loading={loading} onPress={() => {}} className="w-full">
            <StyledText
              weight="semibold"
              size="base"
              className="text-white"
              uppercase
            >
              Submit
            </StyledText>
          </StyledButton>
        </View>
      </View>
    </Container>
  );
}
