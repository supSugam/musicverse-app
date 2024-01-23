import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';

export default function Welcome() {
  return (
    <LinearGradient
      colors={[COLORS.background.dark, COLORS.background.light]}
      className="flex-1"
    >
      <Text className="text-4xl text-center text-white">Welcome</Text>
    </LinearGradient>
  );
}
