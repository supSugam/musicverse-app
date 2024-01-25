import React from 'react';
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

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is Required')
    .email('Please enter a valid email address.'),
  username: yup
    .string()
    .required('Please enter a valid username.')
    .min(4, 'Username must be at least 4 characters.'),
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
  const navigateToRegistrationScreen = () => {
    navigation.navigate('Register');
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <View className="flex-1 h-full flex-col justify-center items-center p-8 py-16 pt-24">
            <View className="flex flex-row items-center my-16 gap-3 self-start">
              <Image
                source={require('@/assets/images/logo.png')}
                contentFit="cover"
                transition={300}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: 'center',
                  transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                }}
              />
              <StyledText
                weight="bold"
                tracking="tighter"
                size="3xl"
                className="text-violet-300"
              >
                MusicVerse
              </StyledText>
            </View>

            <View className="flex flex-col mt-auto w-full">
              <StyledTextField
                label="Email"
                control={control}
                errorMessage={errors.email?.message}
                controllerName="email"
              />
              <StyledTextField
                label="Username"
                control={control}
                errorMessage={errors.username?.message}
                controllerName="username"
              />
              <StyledTextField
                label="Password"
                control={control}
                errorMessage={errors.password?.message}
                controllerName="password"
              />
            </View>

            <View className="flex flex-col mt-auto w-full">
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
                  Skip to Login
                </StyledText>
              </StyledButton>

              <StyledButton onPress={handleSubmit(onSubmit)} className="w-full">
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
