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
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { IRegisterUserDTO } from '@/services/auth/IAuth';
import Toast from 'react-native-toast-message';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is Required')
    .email('Please enter a valid email address.'),
  username: yup
    .string()
    .required('Please enter a valid username.')
    .min(4, 'Username must be at least 4 characters.')
    .matches(/^\S*$/, 'Username cannot contain spaces.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character'
    ),
});

export default function Register({ navigation }: { navigation: any }) {
  const navigateToLoginScreen = () => {
    navigation.navigate('Login');
  };

  const [loading, setLoading] = useState<boolean>(false);
  const register = useAuthStore((state) => state.register);

  const registerUserMutation = useMutation({
    mutationFn: async (payload: IRegisterUserDTO) => await register(payload),
    onSuccess: (data: any) => {
      Toast.show({
        type: 'success',
        text1: 'Please check your email for the OTP.',
      });
      setLoading(false);
      navigation.navigate('OTPVerification', {
        email: data.data.result.email,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error.response.data.message[0],
      });
      setLoading(false);
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    registerUserMutation.mutate(data);
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
            backgroundColor: 'red',
          }}
          automaticallyAdjustKeyboardInsets={true}
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
                label="Email"
                control={control}
                errorMessage={errors.email?.message}
                controllerName="email"
                autoComplete="email"
              />
              <StyledTextField
                label="Username"
                control={control}
                errorMessage={errors.username?.message}
                controllerName="username"
                autoComplete="username-new"
              />
              <StyledTextField
                label="Password"
                control={control}
                errorMessage={errors.password?.message}
                secureTextEntry
                controllerName="password"
                autoComplete="password-new"
              />
            </View>

            <View className="flex mt-auto mb-4 flex-col w-full">
              <StyledButton
                fullWidth
                variant="secondary"
                onPress={navigateToLoginScreen}
                className="mb-4"
              >
                <StyledText
                  weight="semibold"
                  size="base"
                  className="text-white"
                  uppercase
                >
                  Skip to Login
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
                  Sign Up
                </StyledText>
              </StyledButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
