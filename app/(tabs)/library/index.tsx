import React, { useEffect } from 'react';
import Container from '@/components/Container';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import Playlists from '@/components/MyLibrary/Playlists';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { consoleLogFormattedObject } from '@/utils/helpers/Object';

import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';

const Tab = createMaterialTopTabNavigator();

const TabBarIcon = ({
  routeName,
  isFocused,
}: {
  routeName: string;
  isFocused: boolean;
}) => {
  const animatedIconWidth = new Animated.Value(0);

  Animated.timing(animatedIconWidth, {
    toValue: isFocused ? 1 : 0,
    duration: 200,
    useNativeDriver: false,
  }).start();

  return (
    <Animated.View
      style={[
        {
          marginRight: isFocused ? 5 : 0,
          width: animatedIconWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 24],
          }),
        },
      ]}
    >
      <MaterialIcons name={getIconName(routeName)} size={24} color="white" />
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
      return 'music-note';
    case 'Uploads':
      return 'cloud-upload';
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
            accessibilityRole="button"
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
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name="Playlists" component={Playlists} />
        <Tab.Screen name="Albums" component={Playlists} />
        <Tab.Screen name="Tracks" component={Playlists} />
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
  },

  tabBarRoute: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
  },
});
