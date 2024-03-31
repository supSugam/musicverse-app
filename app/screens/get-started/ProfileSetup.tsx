import { useState } from 'react';
import StyledText from '@/components/reusables/StyledText';
import { KeyboardAvoidingView, View, ScrollView } from 'react-native'; // Import TouchableOpacity for the button
import Container from '@/components/Container';
import { StyledButton } from '@/components/reusables/StyledButton';
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
import { useProfileQuery } from '@/hooks/react-query/useProfileQuery';
import StyledTextField from '@/components/reusables/StyledTextInput';
import ImageDisplay from '@/components/reusables/ImageDisplay';
import { useImagePicker } from '@/hooks/useImagePicker';
import { MediaTypeOptions } from 'expo-image-picker';
import { convertObjectToFormData } from '@/utils/helpers/Object';
import { imageAssetToFile } from '@/utils/helpers/file';
import { toastResponseMessage } from '@/utils/toast';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is Required')
    .min(4, 'Name must be at least 4 characters.'),
  bio: yup
    .string()
    .required('Bio is Required')
    .min(10, 'Bio must be at least 10 characters.'),
});

export default function ProfileSetup({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState<boolean>(false);

  const { create } = useProfileQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { SCREEN_HEIGHT } = useScreenDimensions();
  const [profileCoverWidth, setProfileCoverWidth] = useState<number>(0);

  const { pickImage: pickProfileCover, image: profileCover } = useImagePicker({
    allowsEditing: true,
    mediaTypes: MediaTypeOptions.Images,
    selectionLimit: 1,
    aspect: [4, 3],
  });

  const { pickImage: pickProfileAvatar, image: profileAvatar } = useImagePicker(
    {
      allowsEditing: true,
      mediaTypes: MediaTypeOptions.Images,
      selectionLimit: 1,
      aspect: [1, 1],
    }
  );

  const onSubmit = async (data: yup.InferType<typeof schema>) => {
    if (!profileCover || !profileAvatar) {
      toastResponseMessage({
        content: 'Please select a cover and avatar',
        type: 'error',
      });
    }
    setLoading(true);
    const avatar = imageAssetToFile(profileAvatar?.[0]);
    const cover = imageAssetToFile(profileCover?.[0]);
    const payload = {
      name: data.name,
      bio: data.bio,
    } as any;

    if (avatar) {
      payload['avatar'] = avatar;
    }
    if (cover) {
      payload['cover'] = cover;
    }
    const formPayload = convertObjectToFormData(payload) as FormData;

    await create.mutateAsync(formPayload, {
      onSuccess: () => {
        // toastResponseMessage({
        //   content: `Welcome, ${data.name}!`,
        //   type: 'success',
        // });
        // navigation.navigate('Home');
      },
      onError: (error) => {
        toastResponseMessage({
          content: error,
          type: 'error',
        });
        setLoading(false);
      },
    });
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

            <StyledText size="lg" weight="semibold" className="text-white my2">
              One more step, let's get to know you
            </StyledText>

            <View
              className="flex mt-4 w-full relative"
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setProfileCoverWidth(width);
              }}
            >
              <ImageDisplay
                placeholder="Cover Image"
                width={'100%'}
                height={profileCoverWidth * 0.75}
                onPress={pickProfileCover}
                source={profileCover?.[0] ? { uri: profileCover[0].uri } : null}
                shadows
              />

              <View className="absolute -bottom-8 right-4">
                <ImageDisplay
                  placeholder={<StyledText>Avatar</StyledText>}
                  width={profileCoverWidth * 0.25}
                  height={profileCoverWidth * 0.25}
                  onPress={pickProfileAvatar}
                  source={
                    profileAvatar?.[0] ? { uri: profileAvatar[0].uri } : null
                  }
                  borderRadius={'full'}
                  shadows
                />
              </View>
            </View>

            <View className="flex flex-col mt-auto w-full">
              <StyledTextField
                label="Name"
                control={control}
                errorMessage={errors.name?.message}
                controllerName="name"
                autoComplete="name"
                variant="underlined"
              />
              <StyledTextField
                control={control}
                controllerName="bio"
                placeholder="Your Bio"
                numberOfLines={2}
                errorMessage={errors.bio?.message}
                variant="underlined"
              />
            </View>

            <View className="flex mt-auto mb-4 flex-col w-full">
              <StyledButton
                // loading={loading}
                onPress={handleSubmit(onSubmit)}
                className="w-full"
              >
                <StyledText
                  weight="semibold"
                  size="base"
                  className="text-white"
                  uppercase
                >
                  Start Listening
                </StyledText>
              </StyledButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
