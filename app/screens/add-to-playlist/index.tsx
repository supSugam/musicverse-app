import AddToPlaylistSC1 from '@/components/Playlist/AddToPlaylistSC1';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';

const Stack = createNativeStackNavigator();
export default function AddToPlaylistStack() {
  return (
    <View style={{ flex: 1, zIndex: 999 }}>
      <Stack.Group
        screenOptions={{
          headerTransparent: true,
          headerBackTitleVisible: Platform.OS === 'ios' ? true : false,
          presentation: 'formSheet',
        }}
      >
        <Stack.Screen
          name="AddToPlaylistSC1"
          component={AddToPlaylistSC1}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
    </View>
  );
}
