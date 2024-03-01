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

import { useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';

interface SwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  horizontalThreshold?: number;
  verticalThreshold?: number;
}

// export const useSwipeGesture = ({
//   onSwipeLeft,
//   onSwipeRight,
//   onSwipeUp,
//   onSwipeDown,
//   horizontalThreshold = 50, // Default threshold values
//   verticalThreshold = 50,
// }: SwipeGestureProps) => {
//   const [initialX, setInitialX] = useState<number>(0);
//   const [initialY, setInitialY] = useState<number>(0);
//   const [finalX, setFinalX] = useState<number>(0);
//   const [finalY, setFinalY] = useState<number>(0);
//   const panGesure = Gesture.Pan()
//     .runOnJS(true)
//     .onTouchesDown((event) => {
//       setInitialX(event.allTouches[0].absoluteX);
//       setInitialY(event.allTouches[0].absoluteY);
//     })
//     .onTouchesMove((event) => {
//       setFinalX(event.allTouches[0].absoluteX);
//       setFinalY(event.allTouches[0].absoluteY);
//     })
//     .onTouchesUp((event) => {
//       if (initialX - finalX > horizontalThreshold) {
//         onSwipeLeft && onSwipeLeft();
//       } else if (finalX - initialX > horizontalThreshold) {
//         onSwipeRight && onSwipeRight();
//       } else if (initialY - finalY > verticalThreshold) {
//         onSwipeUp && onSwipeUp();
//       } else if (finalY - initialY > verticalThreshold) {
//         onSwipeDown && onSwipeDown();
//       }
//     });

//   return panGesure;
// };
