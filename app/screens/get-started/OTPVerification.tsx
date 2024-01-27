import { useMemo, useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { View } from 'react-native'; // Import TouchableOpacity for the button
import Container from '@/components/Container';
import StyledButton from '@/components/reusables/StyledButton';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import LogoWithName from '@/components/reusables/LogoWithName';
import PinCodeInput from '@/components/PinCodeInput';
import LottieView from 'lottie-react-native';
import { WaitingForCodeLA } from '@/assets/lottie';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isValidNumber } from '@/utils/helpers/string';

export default function Register({ navigation }: { navigation: any }) {
  const navigateToRegistrationScreen = () => {
    navigation.navigate('Register');
  };
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useScreenDimensions();

  const [loading, setLoading] = useState<boolean>(false);

  const [otpCode, setOtpCode] = useState<string>('');
  const { height } = useScreenDimensions();

  const WaitingForCodeJSON = useMemo(() => WaitingForCodeLA, []);

  const onOTPSubmit = () => {
    setLoading(true);
    console.log('otpCode', otpCode);
    if (otpCode.length !== 6 || !isValidNumber(otpCode)) {
      setLoading(false);
      return;
    }
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}
      >
        <View
          style={{
            minHeight: height,
          }}
          className="flex-1 h-full flex-col justify-end items-center p-8 py-6 pt-24 mt-auto"
        >
          <LogoWithName discludeName />

          <StyledText
            weight="semibold"
            size="2xl"
            className="text-center text-primary mt-4"
          >
            Please enter the code we sent you to verify your email address.
          </StyledText>

          <View className="flex flex-col w-full mt-12">
            <PinCodeInput
              onChange={(value) => {
                setOtpCode(value);
              }}
              value={otpCode}
              length={6}
            />
          </View>
          <LottieView
            source={WaitingForCodeJSON}
            autoPlay
            // loop={false}
            loop
            speed={0.25}
            style={{
              width: SCREEN_WIDTH * 0.5,
              height: SCREEN_HEIGHT * 0.25,
              alignSelf: 'center',
              transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
              marginTop: 52,
            }}
          />

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

            <StyledButton
              loading={loading}
              onPress={onOTPSubmit}
              className="w-full"
            >
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
      </KeyboardAwareScrollView>
    </Container>
  );
}
