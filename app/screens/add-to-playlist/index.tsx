import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Container from '@/components/Container';
import BackNavigator from '@/components/reusables/BackNavigator';
import AddToPlaylistSC1 from '@/components/Playlist/AddToPlaylistSC1';

const Stack = createNativeStackNavigator();

const Tab = createMaterialTopTabNavigator();

function AddToPlaylistTabs() {
  return (
    <Container includeNavBar navbarTitle="Add to Playlist">
      <Tab.Navigator tabBar={() => <BackNavigator showBackText />}>
        <Tab.Screen name="AddToPlaylistSC1" component={AddToPlaylistSC1} />
      </Tab.Navigator>
    </Container>
  );
}

export default function AddToPlaylistScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerBackTitleVisible: Platform.OS === 'ios' ? true : false,
      }}
    >
      <Stack.Screen
        name="AddToPlaylistTabs"
        component={AddToPlaylistTabs}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
