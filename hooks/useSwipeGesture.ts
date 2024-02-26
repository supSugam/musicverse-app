import { useRef } from 'react';
import { PanResponder } from 'react-native';

interface SwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  horizontalThreshold?: number;
  verticalThreshold?: number;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  horizontalThreshold = 50, // Default threshold values
  verticalThreshold = 50,
}: SwipeGestureProps) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.abs(dx) >= horizontalThreshold) {
            if (dx > 0 && onSwipeRight) {
              onSwipeRight();
            } else if (dx < 0 && onSwipeLeft) {
              onSwipeLeft();
            }
          }
        } else {
          if (Math.abs(dy) >= verticalThreshold) {
            if (dy > 0 && onSwipeDown) {
              onSwipeDown();
            } else if (dy < 0 && onSwipeUp) {
              onSwipeUp();
            }
          }
        }
      },
    })
  ).current;

  return panResponder.panHandlers;
};
