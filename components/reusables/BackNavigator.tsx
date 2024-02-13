import { MaterialIcons } from '@expo/vector-icons';
import StyledText from './StyledText';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
export interface IBackNavigatorProps {
  showBackText?: boolean;
  title?: string;
}
const BackNavigator = ({
  showBackText = false,
  title = '',
}: IBackNavigatorProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex flex-row items-center justify-between w-full"
      style={{
        backgroundColor: '#000000',
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
      onPress={() => navigation.goBack()}
    >
      <View className="flex flex-row items-center">
        <MaterialIcons name="chevron-left" size={36} color={'#fff'} />
        {showBackText && (
          <StyledText weight="bold" size="lg">
            Back
          </StyledText>
        )}
      </View>

      <StyledText weight="bold" size="lg" className="mx-auto">
        {title}
      </StyledText>
      <View className="w-12" />
    </TouchableOpacity>
  );
};

export default BackNavigator;
