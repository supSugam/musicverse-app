import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import useScreenDimensions from '@/hooks/useScreenDimensions';
import StyledText from './StyledText';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native';

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

  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
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

  const renderOptionItem = ({ item }: { item: string }) => {
    const isSelected = tempSelected.includes(item);
    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.selectedOptionItem]}
        onPress={() => handleOptionPress(item)}
      >
        <Text
          style={isSelected ? styles.selectedOptionText : styles.optionText}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase())
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
                  <MaterialIcons name="close" size={16} color="black" />
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalBackground}>
            <Animated.View style={[styles.modalContainer, modalContainerStyle]}>
              <View style={styles.modalHeader}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={(text) => setSearchText(text)}
                />
                <TouchableOpacity onPress={toggleModal} className="ml-2">
                  <MaterialIcons name="close" size={24} color="black" />
                  {/* Close button */}
                </TouchableOpacity>
              </View>
              <FlatList
                data={filteredOptions}
                renderItem={renderOptionItem}
                keyExtractor={(item, index) => index.toString()}
              />
              {!single && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'transparent' }]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 20,
    margin: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
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
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedOptionItem: {
    backgroundColor: '#cfd8dc',
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
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
  },
});

export default SelectOption;
