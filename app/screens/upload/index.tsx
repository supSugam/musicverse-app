import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectUploadType from './SelectUploadType';
import AlbumDetailsSC1 from './AlbumDetailsSC1';
import AlbumDetailsSC2 from './AlbumDetailsSC2';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();

export default function UploadStackSreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBackTitleVisible: Platform.OS === 'ios' ? true : false,
      }}
    >
      <Stack.Screen
        name="SelectUploadType"
        component={SelectUploadType}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AlbumDetailsSC1"
        component={AlbumDetailsSC1}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AlbumDetailsSC2"
        component={AlbumDetailsSC2}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
