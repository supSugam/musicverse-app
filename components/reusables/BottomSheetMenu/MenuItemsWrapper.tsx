import COLORS from '@/constants/Colors';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import StyledText from '../StyledText';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface IMenuItemsWrapperProps {
  children: React.ReactNode;
  draggable?: boolean;
  header?: string | React.ReactNode;
}

const MenuItemsWrapper = ({
  children,
  header,
  draggable,
}: IMenuItemsWrapperProps) => {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const wrapperTranslateY = useSharedValue(400);

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: wrapperTranslateY.value }],
    };
  });

  const conditionalHeader = useMemo(() => {
    if (!header) return null;
    if (typeof header === 'string') {
      return (
        <StyledText size="xl" weight="bold">
          {header}
        </StyledText>
      );
    }
    if (React.isValidElement(header)) {
      return header;
    }
  }, [header]);

  const { height } = useWindowDimensions();

  // Handle Dragging

  const [initialAbsoluteY, setInitialAbsoluteY] = useState<number>(0);

  const panGesture = Gesture.Pan()
    .onTouchesDown((event) => {})
    .onTouchesMove((event) => {
      const absoluteY = event.allTouches[0].absoluteY;
      setInitialAbsoluteY(absoluteY);
      wrapperTranslateY.value = absoluteY - containerHeight;
    })
    .onTouchesUp((event) => {
      if (containerHeight === 0) return;
      if (containerHeight <= height / 2) {
        wrapperTranslateY.value = withTiming(0);
        return;
      }
      if (event.allTouches[0].absoluteY - initialAbsoluteY > 10) {
        wrapperTranslateY.value = withTiming(200);
        return;
      }
    })
    .runOnJS(true);

  useEffect(() => {
    // positive -> down
    // negative -> up

    if (containerHeight === 0) return;
    if (containerHeight <= height / 2) {
      wrapperTranslateY.value = withTiming(0);
    } else {
      wrapperTranslateY.value = withTiming(200);
    }
  }, [containerHeight]);
  return (
    <GestureHandlerRootView style={{ width: '100%' }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.mainWrapper, wrapperAnimatedStyle]}
          onLayout={(event) => {
            setContainerHeight(event.nativeEvent.layout.height);
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            containerStyle={{ width: '100%' }}
          >
            <View
              style={{
                height: 4,
                width: 40,
                backgroundColor: 'white',
                marginVertical: 10,
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          {conditionalHeader && (
            <View style={styles.headerWrapper}>{conditionalHeader}</View>
          )}
          <View style={styles.scrollViewWrapper}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    width: '100%',
    // backgroundColor: COLORS.neutral.semidark,
    backgroundColor: 'red',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  scrollViewWrapper: {
    width: '100%',
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default MenuItemsWrapper;
