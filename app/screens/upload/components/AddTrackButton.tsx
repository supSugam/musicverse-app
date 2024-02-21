import { TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface IAddTrackButtonProps {
  onAddTrack: () => void;
  isUploadTypeSingle: boolean;
  collapse: boolean;
}

const AddTrackButton = ({
  onAddTrack,
  isUploadTypeSingle,
  collapse,
}: IAddTrackButtonProps) => {
  const HEIGHT: number = 216;
  const componentHeight = useSharedValue<number>(collapse ? 0 : HEIGHT);
  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(componentHeight.value, { duration: 300 }),
      overflow: 'hidden',
    };
  });

  useEffect(() => {
    componentHeight.value = collapse ? 0 : HEIGHT;
  }, [collapse]);

  return (
    <Animated.View style={animatedHeight}>
      <TouchableOpacity
        onPress={onAddTrack}
        activeOpacity={0.8}
        style={{ marginVertical: 20 }}
        className="mt-8 px-6"
      >
        <LinearGradient
          colors={[
            COLORS.neutral.black,
            COLORS.neutral.dark,
            COLORS.neutral.dense,
          ]}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            borderWidth: 1,
            borderColor: `${COLORS.neutral.light}60`,
            borderRadius: 6,
            padding: 20,
            width: '100%',
          }}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="add-box" size={28} color="white" />
          <StyledText size="2xl" weight="bold" className="text-center mt-3">
            Add Track
          </StyledText>
          <StyledText size="sm" weight="medium" className="text-center mt-1">
            {isUploadTypeSingle
              ? 'Add your track to MusicVerse! You can only upload one track at a time.'
              : 'Add multiple tracks to MusicVerse! You can only upload a maximum of 10 tracks for an album.'}
          </StyledText>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AddTrackButton;
