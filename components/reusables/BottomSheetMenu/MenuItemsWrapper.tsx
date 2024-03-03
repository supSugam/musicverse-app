import COLORS from '@/constants/Colors';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Touchable,
  useWindowDimensions,
} from 'react-native';
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
  TouchableWithoutFeedback,
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
      // height: wrapperTranslateY.value === 0 ? '100%' : 'auto',
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
  const [previousAbsoluteY, setPreviousAbsoluteY] = useState<number>(0);

  const panGesture = Gesture.Pan()
    .onTouchesDown((event) => {
      const absoluteY = event.allTouches[0].absoluteY;
      setInitialAbsoluteY(absoluteY);
      setPreviousAbsoluteY(absoluteY);
    })
    .onUpdate((event) => {
      setPreviousAbsoluteY(event.absoluteY);
    })
    .onTouchesMove((event) => {
      const { absoluteY } = event.allTouches[0];

      // Calculate the difference between the current and initial touch positions
      const diff = absoluteY - previousAbsoluteY;

      // Update the wrapperTranslateY value by accumulating the changes
      wrapperTranslateY.value += diff;
    })
    .onTouchesUp((event) => {
      if (containerHeight <= height / 2) {
        wrapperTranslateY.value = withTiming(0);
        return;
      }
      const { absoluteY: finalAbsoluteY } = event.allTouches[0];
      console.log('diff', initialAbsoluteY - finalAbsoluteY, height / 2);

      if (initialAbsoluteY - finalAbsoluteY > 0) {
        wrapperTranslateY.value = withTiming(0);
      } else {
        if (containerHeight <= height / 2) {
          wrapperTranslateY.value = withTiming(height - containerHeight - 60);
        } else {
          wrapperTranslateY.value = withTiming(height / 2);
        }
      }
    })
    .runOnJS(true);

  useEffect(() => {
    // positive -> down
    // negative -> up
    console.log('containerHeight', containerHeight, height / 2);

    if (containerHeight <= height / 2) {
      wrapperTranslateY.value = withTiming(height - containerHeight - 60);
    } else {
      wrapperTranslateY.value = withTiming(height / 2);
    }
  }, [containerHeight, height]);

  return (
    <GestureHandlerRootView style={{ width: '100%' }}>
      <TouchableWithoutFeedback style={styles.rootWrapper}>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[wrapperAnimatedStyle]}
            onLayout={(event) => {
              setContainerHeight(event.nativeEvent.layout.height);
            }}
          >
            <View style={styles.contentWrapper}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.draggableIndicatorWrapper}
              >
                <View style={styles.draggableIndicator} />
              </TouchableOpacity>
              {conditionalHeader && (
                <View style={styles.headerWrapper}>{conditionalHeader}</View>
              )}
              <View style={styles.childrenWrapper}>{children}</View>
            </View>
          </Animated.View>
        </GestureDetector>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    backgroundColor: 'green',
    height: '100%',
    position: 'relative',
  },

  childrenWrapper: {
    width: '100%',
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    width: '100%',
    backgroundColor: COLORS.neutral.semidark,
  },
  draggableIndicator: {
    height: 4,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  draggableIndicatorWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuItemsWrapper;
