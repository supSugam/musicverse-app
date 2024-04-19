import { useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { KeyboardAvoidingView, View, ScrollView } from 'react-native'; // Import TouchableOpacity for the button
import Container from '@/components/Container';
import { StyledButton } from '@/components/reusables/StyledButton';
import StyledTextField from '@/components/reusables/StyledTextInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Platform } from 'react-native';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import LogoWithName from '@/components/reusables/LogoWithName';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { CredentialsType } from '@/services/auth/IAuth';
import { toastResponseMessage } from '@/utils/toast';
import 'core-js/stable/atob';
import { CommonActions } from '@react-navigation/native';
import { CallbackType } from '@/utils/enums/CallbackType';
const schema = yup.object().shape({
  usernameOrEmail: yup.string().required('Enter your username or email.'),
  password: yup.string().required('Password cannot be empty.'),
});

export default function Login({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { login, initiateResetPassword } = useAuthStore();

  const loginUserMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      if (!data.data.result.hasCompletedProfile) {
        navigation.dispatch(CommonActions.navigate('ProfileSetup'));
      } else {
        toastResponseMessage({
          type: 'success',
          content: 'Logged In.',
        });
        navigation.dispatch(CommonActions.navigate('TabsLayout'));
      }

      setLoading(false);
    },
    onError: (error: any) => {
      toastResponseMessage({
        type: 'error',
        content: error,
      });
      setLoading(false);
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigateToResetPassword = () => {
    if (errors.usernameOrEmail) {
      toastResponseMessage({
        type: 'error',
        content: 'Please enter a valid email address.',
      });
      return;
    }
    const email = getValues('usernameOrEmail');
    if (email.includes('@')) {
      initiateResetPassword(email);
      toastResponseMessage({
        type: 'info',
        content: 'Please check your email for the OTP.',
      });
      navigation.dispatch(
        CommonActions.navigate('OTPVerification', {
          email,
          onVerifiedCallback: CallbackType.RESET_PASSWORD,
        })
      );
    } else {
      toastResponseMessage({
        type: 'error',
        content: 'You need to enter your email address to reset password.',
      });
    }
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    const credentialsType = data.usernameOrEmail.includes('@')
      ? CredentialsType.EMAIL
      : CredentialsType.USERNAME;
    loginUserMutation.mutate({
      credentialsType,
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    });
  };

  const { SCREEN_HEIGHT } = useScreenDimensions();

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              minHeight: SCREEN_HEIGHT,
            }}
            className="flex-1 h-full flex-col justify-end items-center p-8 py-16 pt-24 bg-black mt-auto"
          >
            <LogoWithName className="mt-2" />

            <View className="flex flex-col mt-auto w-full">
              <StyledTextField
                label="Username or Email"
                control={control}
                errorMessage={errors.usernameOrEmail?.message}
                controllerName="usernameOrEmail"
                autoComplete="email"
              />
              <StyledTextField
                label="Password"
                control={control}
                errorMessage={errors.password?.message}
                controllerName="password"
                autoComplete="password"
                toggleableVisibility
              />
            </View>

            <View className="flex mt-auto mb-4 flex-col w-full">
              <StyledButton
                fullWidth
                variant="secondary"
                onPress={navigateToResetPassword}
                className="mb-4"
              >
                <StyledText
                  weight="semibold"
                  size="base"
                  className="text-white"
                  uppercase
                >
                  Forgot Password?
                </StyledText>
              </StyledButton>

              <StyledButton
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                className="w-full"
              >
                <StyledText
                  weight="semibold"
                  size="base"
                  className="text-white"
                  uppercase
                >
                  Login
                </StyledText>
              </StyledButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
