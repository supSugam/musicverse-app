import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import StyledText from './StyledText';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native';
import ModalWrapper from './ModalWrapper';
import { StyledTouchableOpacity } from './StyledButton';
import StyledTextField from './StyledTextInput';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toastResponseMessage } from '@/utils/toast';

const schema = yup.object().shape({
  search: yup.string(),
});

interface SelectOptionProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  single?: boolean;
  maxSelection?: number;
  minSelection?: number;
  errorMessage?: string | null;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select',
  minSelection = 0,
  maxSelection = options.length,
  single = false,
  errorMessage,
}) => {
  if (minSelection > maxSelection) {
    throw new Error(
      'minSelection should be less than or equal to maxSelection'
    );
  }
  const { control, watch } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: { search: '' },
  });
  const searchTerm = watch('search');

  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>([]); // Initialize tempSelected as an empty array
  const { SCREEN_HEIGHT } = useScreenDimensions(); // Assuming you get SCREEN_HEIGHT from your custom hook
  const fadeAnim = useSharedValue<number>(0);

  const errorMessageHeight = useSharedValue<number>(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: errorMessageHeight.value,
    };
  });

  useEffect(() => {
    errorMessageHeight.value = withTiming(errorMessage ? 30 : 0);
  }, [errorMessage]);

  const toggleModal = () => {
    if (!modalVisible) {
      setTempSelected([...selected]); // Set tempSelected to selected when opening modal
      fadeAnim.value = withTiming(1, { duration: 300 });
    } else {
      fadeAnim.value = withTiming(0, { duration: 300 });
    }
    setModalVisible((prev) => !prev);
  };

  const handleOptionPress = (option: string) => {
    if (single) {
      onChange([option]);
      toggleModal();
    } else {
      if (
        tempSelected.length === maxSelection &&
        !tempSelected.includes(option)
      )
        return;
      const newSelected = tempSelected.includes(option)
        ? tempSelected.filter((item) => item !== option)
        : [...tempSelected, option];
      setTempSelected(newSelected);
    }
  };

  const handleCancel = () => {
    toggleModal();
  };

  const handleConfirm = () => {
    onChange([...tempSelected]); // Update the selected state immediately
    toggleModal();
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  );

  const modalContainerStyle = useAnimatedStyle(() => {
    return {
      height: SCREEN_HEIGHT / 2,
      opacity: fadeAnim.value,
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.input}
        onPress={toggleModal}
        activeOpacity={0.8}
      >
        {single ? (
          <StyledText weight="normal" size="lg">
            {selected[0] || placeholder}
          </StyledText>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selected.length === 0 ? (
              <StyledText weight="normal" size="lg">
                {placeholder}
              </StyledText>
            ) : (
              (selected as string[]).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedItem}
                  onPress={() => {
                    const newSelected = selected.filter(
                      (selectedItem) => selectedItem !== item
                    );
                    onChange(newSelected);
                  }}
                >
                  <StyledText className="mr-2">{item}</StyledText>
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </TouchableOpacity>

      <ModalWrapper
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onClose={toggleModal}
        closeOnOutsideClick
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, modalContainerStyle]}>
            <View style={styles.modalHeader}>
              <View className="flex-1">
                <StyledTextField
                  placeholder="Search..."
                  variant="underlined"
                  control={control}
                  controllerName="search"
                />
              </View>

              <TouchableOpacity onPress={toggleModal} className="ml-2">
                <MaterialIcons name="close" size={24} color="white" />
                {/* Close button */}
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              scrollEnabled
              showsVerticalScrollIndicator
            >
              {filteredOptions.map((option, index) => {
                const isSelected = tempSelected.includes(option);
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                    onPress={() => handleOptionPress(option)}
                  >
                    <StyledText weight="normal" size="lg">
                      {option}
                      {isSelected && ' ✓'}
                    </StyledText>
                  </Pressable>
                );
              })}
            </ScrollView>

            {!single && (
              <View style={styles.buttonContainer}>
                <StyledTouchableOpacity
                  style={styles.button}
                  onPress={handleCancel}
                >
                  <StyledText weight="bold" size="sm" className="text-white">
                    Cancel
                  </StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  style={styles.button}
                  onPress={handleConfirm}
                >
                  <StyledText weight="bold" size="sm" className="text-white">
                    Confirm
                  </StyledText>
                </StyledTouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </ModalWrapper>
      <Animated.View style={animatedStyle}>
        <StyledText
          size="sm"
          weight="medium"
          className="text-left mt-1"
          style={{ color: COLORS.red.light }}
        >
          {errorMessage}
        </StyledText>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    borderColor: COLORS.neutral.normal,
  },
  placeholder: {
    color: 'gray',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral.semidark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 4,
    marginLeft: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: COLORS.neutral.dark,
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: COLORS.neutral.normal,
    color: 'white',
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.neutral.normal,
  },
  selectedOptionItem: {
    backgroundColor: COLORS.neutral.semidark,
  },
  optionText: {
    fontWeight: 'normal',
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
});

export default SelectOption;
