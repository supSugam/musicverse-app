import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface ISelectedTouchableProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  selected?: boolean;
  iconSize?: number;
  iconProps?: React.ComponentProps<typeof TouchableOpacity>;
}
const SelectedTouchable = ({
  iconSize,
  selected,
  iconProps,
  ...rest
}: ISelectedTouchableProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => {}} {...rest}>
      <MaterialIcons
        name={selected ? 'check-circle' : 'add-circle-outline'}
        size={28}
        color={COLORS.primary.light}
        {...iconProps}
      />
    </TouchableOpacity>
  );
};

export default SelectedTouchable;
