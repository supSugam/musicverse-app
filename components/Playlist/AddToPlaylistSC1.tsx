import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { StyledButton } from '../reusables/StyledButton';
import StyledText from '../reusables/StyledText';
import COLORS from '@/constants/Colors';

const AddToPlaylistSC1 = () => {
  return (
    <View
      className="flex relative h-1/2"
      style={{
        // backgroundColor: COLORS.neutral.dense,
        backgroundColor: 'red',
      }}
    >
      <PrimaryGradient opacity={0.1} />

      <View className="p-8 w-full h-full flex justify-center items-center relative">
        <StyledButton onPress={() => {}} className="w-full">
          <StyledText size="xl" weight="bold" className="text-center">
            Create New Playlist
          </StyledText>
        </StyledButton>

        <StyledButton
          onPress={() => {}}
          className="w-full mt-4"
          variant="secondary"
        >
          <StyledText size="xl" weight="bold" className="text-center">
            Add to Existing Playlist
          </StyledText>
        </StyledButton>
      </View>
    </View>
  );
};

export default AddToPlaylistSC1;

const styles = StyleSheet.create({});
