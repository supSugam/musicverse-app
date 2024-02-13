import {
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from './StyledText';

interface IFilePickerProps extends TouchableOpacityProps {
  onPress: () => void;
  caption: string;
}

const FilePicker = ({ onPress, caption, ...rest }: IFilePickerProps) => {
  return (
    <TouchableOpacity className="mt-2" onPress={onPress} {...rest}>
      <View
        className="flex flex-row w-full rounded-lg px-4 py-2 items-center"
        style={{
          borderWidth: 1,
          borderColor: `${COLORS.neutral.light}20`,
          backgroundColor: COLORS.neutral.dark,
        }}
      >
        <MaterialIcons name="add-box" size={24} color={COLORS.neutral.normal} />

        <StyledText
          size="lg"
          weight="semibold"
          className="text-left ml-3"
          style={{ color: COLORS.neutral.normal }}
        >
          {caption}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

export default FilePicker;
