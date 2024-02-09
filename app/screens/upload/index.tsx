import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectUploadType from './SelectUploadType';

const Stack = createNativeStackNavigator();

export default function UploadStackSreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
      }}
    >
      <Stack.Screen
        name="SelectUploadType"
        component={SelectUploadType}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
