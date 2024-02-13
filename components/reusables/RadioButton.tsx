import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import StyledText from './StyledText';
import COLORS from '@/constants/Colors';

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onSelect,
}) => {
  const scale = useSharedValue(selected ? 1.2 : 1);

  const handlePress = () => {
    onSelect();
    scale.value = withTiming(selected ? 1 : 1.2);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="flex flex-row items-center my-3"
    >
      <View className="mr-2">
        {selected && (
          <MaterialIcons
            name="radio-button-checked"
            size={24}
            color={'#ffffff80'}
          />
        )}
        {!selected && (
          <MaterialIcons
            name="radio-button-unchecked"
            size={24}
            color={'#ffffff80'}
          />
        )}
      </View>
      <StyledText
        weight="bold"
        size="lg"
        style={{ color: COLORS.neutral.normal }}
      >
        {label}
      </StyledText>
    </TouchableOpacity>
  );
};

export default RadioButton;
