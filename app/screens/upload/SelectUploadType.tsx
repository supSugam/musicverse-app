import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import COLORS from '@/constants/Colors';
import { StyledButton } from '@/components/reusables/StyledButton';
import { useUploadStore } from '@/services/zustand/stores/useUploadStore';
import { GLOBAL_STYLES, USER_PERMISSIONS } from '@/utils/constants';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { toastResponseMessage } from '@/utils/toast';

const SelectUploadType = ({ navigation }: { navigation: any }) => {
  const { uploadType, album, setUploadType } = useUploadStore((state) => state);
  const { currentUser } = useAuthStore((state) => state);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = () => {
    setLoading(true);
    switch (uploadType) {
      case 'single':
        navigation.navigate('TracksUploadZone');
        break;
      case 'album':
        navigation.navigate('AlbumTabs');
        break;
      default:
        break;
    }
    setLoading(false);
  };
  useEffect(() => {
    if (uploadType === 'album' && album?.title) {
      navigation.navigate('TracksUploadZone');
      toastResponseMessage({
        content: 'Continue where you left off',
        type: 'success',
      });
    }
  }, []);

  return (
    <Container includeNavBar navbarTitle="Upload">
      <View className="flex flex-1 justify-center items-center">
        <View className="flex justify-between items-center">
          <StyledText weight="extrabold" size="2xl">
            Select Upload Type
          </StyledText>

          <StyledText
            weight="extralight"
            size="sm"
            className="mt-2 text-gray-400"
            uppercase
          >
            What type of content are you uploading?
          </StyledText>
        </View>

        <View className="flex flex-col px-4 my-12 w-full">
          <TouchableOpacity
            style={{
              backgroundColor:
                uploadType === 'single'
                  ? COLORS.primary.light
                  : COLORS.neutral.dark,
            }}
            className="flex p-3 rounded-xl flex-row items-center justify-between border border-gray-600 mb-4"
            activeOpacity={0.8}
            onPress={() => setUploadType('single')}
          >
            <FontAwesome6 name="music" size={32} color="white" />
            <View className="flex flex-col mx-4">
              <StyledText weight="bold" size="lg">
                Single Track
              </StyledText>
              <StyledText size="sm" className="text-gray-100 flex-shrink ">
                Upload a single track, this is an ideal option when you have
                only one track to upload.
              </StyledText>
            </View>
          </TouchableOpacity>

          {/* TODO: Disabled for !member||!artist */}
          <TouchableOpacity
            style={[
              {
                backgroundColor:
                  uploadType === 'album'
                    ? COLORS.primary.light
                    : COLORS.neutral.dark,
              },
              GLOBAL_STYLES.getDisabledStyles(
                !USER_PERMISSIONS.canCreateAlbums(currentUser?.role)
              ),
            ]}
            className="flex p-3 rounded-xl flex-row items-center justify-between border border-gray-600"
            activeOpacity={0.85}
            onPress={() => {
              if (!USER_PERMISSIONS.canCreateAlbums(currentUser?.role)) {
                toastResponseMessage({
                  content: 'Only artists can create albums',
                  type: 'error',
                });
                return;
              }
              setUploadType('album');
            }}
          >
            <MaterialIcons name="album" size={32} color="white" />

            <View className="flex flex-col mx-4">
              <StyledText weight="bold" size="lg">
                An Album
              </StyledText>
              <StyledText size="sm" className="text-gray-100 ">
                Upload an album, this is an ideal option when you have multiple
                tracks to upload.
              </StyledText>
            </View>
          </TouchableOpacity>
          <StyledButton
            onPress={handlePress}
            variant="primary"
            className="mt-16"
            fullWidth
            loading={loading}
          >
            <StyledText weight="bold" size="lg">
              Continue
            </StyledText>
          </StyledButton>
        </View>
      </View>
    </Container>
  );
};

export default SelectUploadType;
