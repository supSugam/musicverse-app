import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BackNavigator from '@/components/reusables/BackNavigator';
import AlbumDetailsSC1 from '../upload/AlbumDetailsSC1';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import StyledText from '@/components/reusables/StyledText';
import { View } from 'react-native';

const Tab = createMaterialTopTabNavigator();
export default function AddToPlaylistTabs() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate('AlbumDetailsSC1' as never);
  }, []);
  return (
    <NavigationContainer independent>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="AlbumDetailsSC1"
          tabBar={() => <BackNavigator showBackText />}
        >
          <Tab.Screen name="AlbumDetailsSC1" component={AlbumDetailsSC1} />
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}
