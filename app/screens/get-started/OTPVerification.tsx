import { useEffect, useMemo, useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { View } from 'react-native'; // Import TouchableOpacity for the button
import Container from '@/components/Container';
import { StyledButton } from '@/components/reusables/StyledButton';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import LogoWithName from '@/components/reusables/LogoWithName';
import PinCodeInput from '@/components/PinCodeInput';
import LottieView from 'lottie-react-native';
import { WaitingForCodeLA } from '@/assets/lottie';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isValidNumber } from '@/utils/helpers/string';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { toastResponseMessage } from '@/utils/toast';
import { CallbackType } from '@/utils/enums/CallbackType';

export default function OTPVerification({
  route,
  navigation,
}: {
  navigation: any;
  route: any;
}) {
  const [otpCode, setOtpCode] = useState<string>('');
  const { SCREEN_WIDTH, SCREEN_HEIGHT } = useScreenDimensions();
  const [loading, setLoading] = useState<boolean>(false);
  const { email, onVerifiedCallback } = route.params;
  const WaitingForCodeJSON = useMemo(() => WaitingForCodeLA, []);
  const { resendOtp, verifyOtp } = useAuthStore((state) => state);
  const [resendTimer, setResendTimer] = useState<number>(60);

  useEffect(() => {
    if (resendTimer > 0) {
      setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
  }, [resendTimer]);

  const resendOtpMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data: any) => {
      toastResponseMessage({
        type: 'success',
        content: 'OTP Resent Successfully.',
      });
    },
    onError: (error: any) => {
      toastResponseMessage({
        type: 'error',
        content: error,
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data: any) => {
      toastResponseMessage({
        type: 'success',
        content: 'OTP Verified Successfully.',
      });
      setLoading(false);
      switch (onVerifiedCallback) {
        case CallbackType.LOGIN:
          navigation.navigate('Login');
          break;
        case CallbackType.RESET_PASSWORD:
          navigation.navigate('ResetPassword', { email });
          break;
      }
    },
    onError: (error: any) => {
      setLoading(false);
      toastResponseMessage({
        type: 'error',
        content: error,
      });
    },
  });

  const onOTPSubmit = () => {
    setLoading(true);
    if (otpCode.length !== 6 || !isValidNumber(otpCode)) {
      toastResponseMessage({
        type: 'error',
        content: 'Invalid OTP, Please try again.',
      });
      setLoading(false);
      return;
    }
    verifyOtpMutation.mutate({ email, otp: +otpCode });
  };
  const onResendCode = () => {
    if (resendTimer > 0) {
      Toast.show({
        type: 'error',
        text1: `You can resend OTP after ${resendTimer} seconds.`,
      });
      return;
    }
    resendOtpMutation.mutate(email);
    setResendTimer(60);
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}
      >
        <View
          style={{
            minHeight: SCREEN_HEIGHT,
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
              onPress={!resendOtpMutation.isPending ? onResendCode : () => {}}
              className="mb-4"
            >
              <StyledText
                weight="semibold"
                size="base"
                className="text-white"
                uppercase
              >
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer} seconds.`
                  : 'Resend Code'}
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
