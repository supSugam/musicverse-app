import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Container from '@/components/Container';
import StyledText from '@/components/reusables/StyledText';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import COLORS from '@/constants/Colors';

const SelectUploadType = () => {
  const [isSelected, setIsSelected] = useState(false);
  const selectedValue = useSharedValue(isSelected ? 1 : 0);

  const handlePress = () => {
    setIsSelected(!isSelected);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(selectedValue.value) }],
    };
  });
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

        <View className="flex flex-col px-10 my-2">
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.neutral.dense,
            }}
            className="flex p-3 rounded-xl flex-row items-center justify-between border border-gray-600"
            activeOpacity={0.8}
          >
            <FontAwesome6 name="music" size={32} color="white" />
            <View className="flex flex-col ml-4">
              <StyledText weight="bold" size="lg">
                Single Track
              </StyledText>
              <StyledText size="sm" className="text-gray-100 flex-shrink ">
                Upload a single track, this is an ideal option when you have
                only one track to upload.
              </StyledText>
            </View>
            <Animated.View
              style={[
                {
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#007BFF',
                },
                animatedStyle,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.neutral.dark,
            }}
            className="flex p-3 rounded-xl flex-row items-center justify-between border border-gray-600"
            activeOpacity={0.85}
          >
            <FontAwesome6 name="music" size={32} color="white" />
            <View className="flex flex-col ml-4">
              <StyledText weight="bold" size="lg">
                An Album
              </StyledText>
              <StyledText size="sm" className="text-gray-100 ">
                Upload an album, this is an ideal option when you have multiple
                tracks to upload.
              </StyledText>
            </View>
            <Animated.View
              style={[
                {
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#007BFF',
                },
                animatedStyle,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default SelectUploadType;
