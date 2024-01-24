import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/get-started/Welcome';

const Stack = createNativeStackNavigator();

export default function index() {
  return (
    <LinearGradient
      colors={[COLORS.background.dense, COLORS.background.dark]}
      className="flex-1"
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </LinearGradient>
  );
}
