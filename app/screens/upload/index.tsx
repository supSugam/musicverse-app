import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectUploadType from './SelectUploadType';
import AlbumDetailsSC1 from './AlbumDetailsSC1';
import AlbumDetailsSC2 from './AlbumDetailsSC2';
import { Platform, View } from 'react-native';
import TracksUploadZone from './TracksUploadZone';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Container from '@/components/Container';
import BackNavigator from '@/components/reusables/BackNavigator';

const Stack = createNativeStackNavigator();

const Tab = createMaterialTopTabNavigator();

function AlbumDetailsTabs() {
  return (
    <Container includeNavBar navbarTitle="Upload">
      <Tab.Navigator tabBar={() => <BackNavigator showBackText />}>
        <Tab.Screen name="AlbumDetailsSC1" component={AlbumDetailsSC1} />
        <Tab.Screen name="AlbumDetailsSC2" component={AlbumDetailsSC2} />
      </Tab.Navigator>
    </Container>
  );
}

export default function UploadStackScreen() {
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
        name="AlbumTabs"
        component={AlbumDetailsTabs}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="AlbumDetailsSC2"
        component={AlbumDetailsSC2}
        options={{
          headerShown: false,
        }}
      /> */}
      <Stack.Screen
        name="TracksUploadZone"
        component={TracksUploadZone}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
