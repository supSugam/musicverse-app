import { useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { KeyboardAvoidingView, View, ScrollView } from 'react-native'; // Import TouchableOpacity for the button
import Container from '@/components/Container';
import StyledButton from '@/components/reusables/StyledButton';
import StyledTextField from '@/components/reusables/StyledTextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Platform } from 'react-native';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import LogoWithName from '@/components/reusables/LogoWithName';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { CredentialsType } from '@/services/auth/IAuth';
import Toast from 'react-native-toast-message';

const schema = yup.object().shape({
  usernameOrEmail: yup.string().required('Enter your username or email.'),
  password: yup.string().required('Password cannot be empty.'),
});

export default function Login({ navigation }: { navigation: any }) {
  const navigateToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  const [loading, setLoading] = useState<boolean>(false);
  const login = useAuthStore((state) => state.login);

  const loginUserMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      Toast.show({
        type: 'success',
        text1: 'Logged in successfully.',
      });
      setLoading(false);
      //   navigation.navigate('OTPVerification', {
      //     email: data.data.result.email,
      //   });
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
                secureTextEntry
                controllerName="password"
                autoComplete="password"
              />
            </View>

            <View className="flex mt-auto mb-4 flex-col w-full">
              <StyledButton
                fullWidth
                variant="secondary"
                onPress={navigateToRegisterScreen}
                className="mb-4"
              >
                <StyledText
                  weight="semibold"
                  size="base"
                  className="text-white"
                  uppercase
                >
                  Not a member? Sign Up.
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
