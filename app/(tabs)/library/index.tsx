import React, { useEffect } from 'react';
import Container from '@/components/Container';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import Playlists from '@/components/MyLibrary/Playlists';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { consoleLogFormattedObject } from '@/utils/helpers/Object';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import Albums from '@/components/MyLibrary/Albums';
import Tracks from '@/components/Tracks/Tracks';

const Tab = createMaterialTopTabNavigator();

const TabBarIndicator = ({
  state,
  layout,
}: {
  state: TabNavigationState<ParamListBase>;
  layout: { width: number; height: number };
}) => {
  const insets = useSafeAreaInsets();
  const inputRange = state.routes.map((_, i) => i);
  const animatedStyle = useAnimatedStyle(() => {
    const outputRange = inputRange.map((i) => {
      const tabWidth = layout.width / inputRange.length;
      const tabLeft = i * tabWidth;
      return {
        left: tabLeft,
        width: tabWidth,
      };
    });
    const left = interpolate(
      state.index,
      inputRange,
      outputRange.map((o) => o.left)
    );
    const width = interpolate(
      state.index,
      inputRange,
      outputRange.map((o) => o.width)
    );
    return {
      left,
      width,
      transform: [{ translateX: insets.left }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.tabBarIndicator, // Apply the styles for the indicator
        animatedStyle,
      ]}
    />
  );
};

const TabBarIcon = ({
  routeName,
  isFocused,
}: {
  routeName: string;
  isFocused: boolean;
}) => {
  const animatedIconWidth = useSharedValue(0);
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      width: animatedIconWidth.value,
      overflow: 'hidden',
    };
  });

  useEffect(() => {
    animatedIconWidth.value = withTiming(isFocused ? 24 : 0, {
      duration: 300,
    });
  }, [isFocused]);

  return (
    <Animated.View
      style={[
        {
          marginRight: isFocused ? 5 : 0,
        },
        animatedIconStyle,
      ]}
    >
      {routeName === 'Uploads' ? (
        <Ionicons name="earth" size={24} color="white" />
      ) : (
        <MaterialIcons name={getIconName(routeName)} size={24} color="white" />
      )}
    </Animated.View>
  );
};

const getIconName = (
  routeName: string
): keyof typeof MaterialIcons.glyphMap => {
  switch (routeName) {
    case 'Playlists':
      return 'library-music';
    case 'Albums':
      return 'album';
    case 'Tracks':
      return 'favorite';
    default:
      return 'library-music';
  }
};

const TabBar = ({
  state,
  descriptors,
  navigation,
  jumpTo,
  layout,
  position,
}: MaterialTopTabBarProps): React.ReactNode => {
  return (
    <View style={styles.tabBarRoot}>
      {/* <TabBarIndicator state={state} layout={layout} /> */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name
        ) as React.ReactNode;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key + index}
            accessibilityRole="button"
            activeOpacity={0.8}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabBarRoute,
              {
                backgroundColor: isFocused
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
                paddingHorizontal: isFocused ? 10 : 0,
              },
            ]}
          >
            <TabBarIcon routeName={route.name} isFocused={isFocused} />

            <StyledText
              weight="semibold"
              size="lg"
              opacity={isFocused ? 'none' : 'high'}
            >
              {label}
            </StyledText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MyLibrary = () => {
  return (
    <Container includeNavBar navbarTitle="My Library">
      <Tab.Navigator
        initialRouteName="Playlists"
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarBounces: true,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name="Playlists" component={Playlists} />
        <Tab.Screen name="Albums" component={Albums} />
        <Tab.Screen name="Tracks" component={Tracks} />
        <Tab.Screen name="Uploads" component={Playlists} />
      </Tab.Navigator>
    </Container>
  );
};

export default MyLibrary;
const styles = StyleSheet.create({
  tabBarRoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'relative',
  },

  tabBarIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2, // Adjust the height as needed
    backgroundColor: 'white', // Change the color as needed
  },

  tabBarRoute: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
  },
});
