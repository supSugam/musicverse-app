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
  closeMenu?: () => void;
}

const MenuItemsWrapper = ({
  children,
  header,
  draggable,
  closeMenu,
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

      const diff = absoluteY - previousAbsoluteY;

      wrapperTranslateY.value += diff;
    })
    .onTouchesUp((event) => {
      const { absoluteY: finalAbsoluteY } = event.allTouches[0];

      if (initialAbsoluteY - finalAbsoluteY > 0) {
        if (wrapperTranslateY.value < -200) {
          wrapperTranslateY.value = withTiming(-height);
          closeMenu?.();
        } else {
          wrapperTranslateY.value = withTiming(0);
        }
      } else {
        if (wrapperTranslateY.value > height / 2) {
          wrapperTranslateY.value = withTiming(height + containerHeight);
          closeMenu?.();
        } else {
          if (containerHeight <= height / 2) {
            wrapperTranslateY.value = withTiming(height - containerHeight);
          } else {
            wrapperTranslateY.value = withTiming(height / 2);
          }
        }
      }
    })
    .runOnJS(true);

  useEffect(() => {
    if (containerHeight <= height / 2) {
      wrapperTranslateY.value = withTiming(height - containerHeight);
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
              {conditionalHeader &&
                (typeof conditionalHeader === 'string' ? (
                  <View style={styles.textHeaderWrapper}>
                    <StyledText size="xl" weight="bold">
                      {conditionalHeader}
                    </StyledText>
                  </View>
                ) : (
                  conditionalHeader
                ))}
              <ScrollView style={styles.childrenWrapper}>{children}</ScrollView>
            </View>
          </Animated.View>
        </GestureDetector>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    height: '100%',
    position: 'relative',
  },

  childrenWrapper: {
    width: '100%',
  },
  textHeaderWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contentWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    width: '100%',
    backgroundColor: COLORS.neutral.dark,
    height: '100%',
  },
  draggableIndicator: {
    height: 4,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  draggableIndicatorWrapper: {
    ...StyleSheet.absoluteFillObject,
    top: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuItemsWrapper;
