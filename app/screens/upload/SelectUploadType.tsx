import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
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

const SelectUploadType = ({ navigation }: { navigation: any }) => {
  const { uploadType, album } = useUploadStore((state) => state);
  const [selectedType, setSelectedType] = useState<'album' | 'single'>(
    uploadType
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = () => {
    setLoading(true);
    useUploadStore.setState({ uploadType: selectedType });
    switch (selectedType) {
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
                selectedType === 'single'
                  ? COLORS.primary.light
                  : COLORS.neutral.dark,
            }}
            className="flex p-3 rounded-xl flex-row items-center justify-between border border-gray-600 mb-4"
            activeOpacity={0.8}
            onPress={() => setSelectedType('single')}
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
            style={{
              backgroundColor:
                selectedType === 'album'
                  ? COLORS.primary.light
                  : COLORS.neutral.dark,
            }}
            className="flex p-3 rounded-xl flex-row items-center justify-between border border-gray-600"
            activeOpacity={0.85}
            onPress={() => setSelectedType('album')}
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
