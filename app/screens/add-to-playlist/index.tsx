import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AddToPlaylistSC1 from '@/components/Playlist/AddToPlaylistSC1';
import BackNavigator from '@/components/reusables/BackNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AddToPlaylistStack() {
  return (
    <Stack.Navigator
      initialRouteName="AddToPlaylistSC1"
      screenOptions={{
        headerTransparent: true,
        header: () => <BackNavigator showBackText title="Add to Playlist" />,
        presentation: 'formSheet',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen
        name="AddToPlaylistSC1"
        component={AddToPlaylistSC1}
        // options={{
        //   presentation: 'transparentModal',
        //   animation: 'slide_from_bottom',
        //   animationDuration: 200,
        // }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar?.currentHeight || 0 : 0,
  },
});
