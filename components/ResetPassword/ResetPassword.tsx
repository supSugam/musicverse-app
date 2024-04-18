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
import Toast from 'react-native-toast-message';
import { toastResponseMessage } from '@/utils/toast';
import { jwtDecode } from 'jwt-decode';
import { ICurrentUser } from '@/utils/Interfaces/IUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'core-js/stable/atob';
import { CommonActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { api } from '@/utils/constants';
import { AxiosResponse } from 'axios';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';
import COLORS from '@/constants/Colors';
const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required.')
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character'
    ),
  reEnterPassword: yup
    .string()
    .required('Re-enter your password.')
    .oneOf([yup.ref('password')], 'Passwords must match.'),
});

export default function ResetPassword({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState<boolean>(false);
  const { logout, currentUser } = useAuthStore();

  const { email } = useLocalSearchParams();

  const resetPasswordMutation = useMutation<
    AxiosResponse<SuccessResponse<{ message: string }>>,
    any,
    any
  >({
    mutationFn: async (payload: any) =>
      await api.post('/auth/reset-password', payload),
    onSuccess: (data: any) => {
      setLoading(false);
      toastResponseMessage({
        type: 'success',
        content: data.data.result.message,
      });
      logout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
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
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    if (!email || typeof email !== 'string') {
      return;
    }
    resetPasswordMutation.mutate({
      email,
      password: data.password,
    });
  };

  const { SCREEN_HEIGHT } = useScreenDimensions();

  const onCancelResetPassword = () => {
    if (currentUser) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TabsLayout' }],
        })
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    }
  };

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

            <StyledText size="xl" weight="semibold" className="mt-5">
              Reset Password for
            </StyledText>
            <StyledText
              size="xl"
              weight="semibold"
              className="mb-4"
              color={COLORS.neutral.light}
            >
              {email}
            </StyledText>

            <View className="flex flex-col mt-auto w-full">
              <StyledTextField
                label="New Password"
                control={control}
                errorMessage={errors.password?.message}
                controllerName="password"
                autoComplete="password"
                toggleableVisibility
              />
              <StyledTextField
                label="Re-enter Password"
                control={control}
                errorMessage={errors.reEnterPassword?.message}
                controllerName="reEnterPassword"
                autoComplete="password"
                toggleableVisibility
              />
            </View>

            <View className="flex mt-auto mb-4 flex-col w-full">
              <StyledButton
                fullWidth
                variant="secondary"
                onPress={onCancelResetPassword}
                className="mb-4"
              >
                <StyledText
                  weight="semibold"
                  size="base"
                  className="text-white"
                  uppercase
                >
                  Cancel
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
                  Reset Password
                </StyledText>
              </StyledButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
