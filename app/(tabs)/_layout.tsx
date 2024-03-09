import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Animated } from 'react-native';
import Home from './home';
import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';
import UploadStackScreen from '../screens/upload';
import { GLOBAL_STYLES } from '@/utils/constants';
import MiniPlayer from '@/components/Player/MiniPlayer';
import { useState } from 'react';
import TrackPlayer from '@/components/Player/TrackPlayer';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import AddToPlaylistSC1 from '@/components/Playlist/AddToPlaylistSC1';
import BackNavigator from '@/components/reusables/BackNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabBarIcon = ({ focused, route }: { focused: boolean; route: any }) => {
  let iconName: keyof typeof Ionicons.glyphMap = 'home';

  const size = 24;
  const color = focused ? COLORS.neutral.light : COLORS.neutral.normal;
  const scale = new Animated.Value(1);
  const translateY = new Animated.Value(0);

  if (route.name === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'Feed') {
    iconName = focused ? 'grid' : 'grid-outline';
  } else if (route.name === 'Search') {
    iconName = focused ? 'search' : 'search-outline';
  } else if (route.name === 'MyLibrary') {
    iconName = focused ? 'library' : 'library-outline';
  } else if (route.name === 'Upload') {
    iconName = focused ? 'add-circle' : 'add-circle-outline';
  }

  Animated.parallel([
    Animated.spring(scale, {
      toValue: focused ? 1.3 : 1,
      useNativeDriver: true,
    }),
    Animated.spring(translateY, {
      toValue: focused ? -5 : 0,
      useNativeDriver: true,
    }),
  ]).start();

  return (
    <Animated.View
      style={{
        transform: [{ scale }, { translateY }],
      }}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState<string>('Home');
  return (
    <>
      <Stack.Group
        screenOptions={({ navigation }) => ({
          stackPresentation: 'modal',
          headerLeft: () => <BackNavigator showBackText />,
        })}
      >
        <Stack.Screen name="AddToPlaylistSC1" component={AddToPlaylistSC1} />
      </Stack.Group>
      <MiniPlayer activeTab={activeTab} />
      <TrackPlayer />
      <Tab.Navigator
        initialRouteName="Home"
        screenListeners={({ navigation, route }) => ({
          tabPress: (e) => {
            setActiveTab(route.name);
          },
        })}
        screenOptions={({ route }) => {
          return {
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} route={route} />
            ),

            tabBarLabel: ({ focused, color }) => {
              const routeName = route.name as string;
              return (
                <StyledText
                  size="xs"
                  tracking="tight"
                  weight={focused ? 'bold' : 'normal'}
                  opacity={focused ? 'none' : 'high'}
                  style={{
                    color: focused
                      ? COLORS.neutral.light
                      : COLORS.neutral.normal,
                  }}
                >
                  {routeName}
                </StyledText>
              );
            },
            headerShown: Platform.OS === 'ios' ? true : false,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            tabBarStyle: {
              paddingBottom: 10,
              paddingTop: 10,
              height: GLOBAL_STYLES.BOTTOM_TAB_BAR_HEIGHT,
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              elevation: 0,
            },
            tabBarOptions: {
              tabBarPosition: 'bottom',
              swipeEnabled: true,
              animationEnabled: true,
            },
            tabBarHideOnKeyboard: true,
          };
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: 'Home',
          }}
        />
        <Tab.Screen
          name="Search"
          component={Home}
          options={{
            headerTitle: 'Search',
          }}
        />
        <Tab.Screen
          name="Feed"
          component={Home}
          options={{
            headerTitle: 'Feed',
          }}
        />
        <Tab.Screen
          name="MyLibrary"
          component={Home}
          options={{
            headerTitle: 'My Library',
          }}
        />
        <Tab.Screen
          component={UploadStackScreen}
          name="Upload"
          options={{
            headerTitle: 'Upload',
          }}
        />
      </Tab.Navigator>
    </>
  );
}
