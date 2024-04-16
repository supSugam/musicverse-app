import { Dimension } from '@/utils/helpers/types';
import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import FadingDarkGradient from '../../Playlist/FadingDarkGradient';
import COLORS from '@/constants/Colors';

interface SkeletonProps extends React.ComponentProps<typeof View> {
  children: React.ReactNode;
  isLoading: boolean;
  skeletonComponent?: React.ReactNode;
  pulse?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  children,
  isLoading,
  skeletonComponent,
  pulse = false,
  ...props
}) => {
  const { style, ...rest } = props;
  const translateX = useSharedValue(50);
  const opacity = useSharedValue(0);

  const skeletonWrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    translateX.value = withDelay(
      100,
      withSequence(
        withTiming(isLoading ? 0 : 50, {
          duration: 500,
          easing: Easing.inOut(Easing.ease),
        }),
        withSpring(isLoading ? 0 : 50, { damping: 10, stiffness: 100 })
      )
    );

    if (isLoading) {
      if (pulse) {
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.6, {
              duration: 600,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: 600,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          true
        );
      } else {
        opacity.value = withTiming(1, {
          duration: 500,
          easing: Easing.inOut(Easing.ease),
        });
      }
    } else {
      opacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isLoading, pulse]);

  if (!skeletonComponent || !isLoading) {
    return children;
  }

  return (
    <Animated.View style={[style, skeletonWrapperAnimatedStyle]} {...rest}>
      {skeletonComponent}
    </Animated.View>
  );
};

type SkeletonLoaderProps = {
  animate?: boolean;
  opacity?: number;
  margin?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  flex?: number;
  speed?: number; // New speed prop
} & (
  | {
      type: 'circle';
      size: Dimension;
      height?: undefined;
      width?: undefined;
      borderRadius?: number;
    }
  | {
      type: 'rect';
      height?: Dimension;
      width?: Dimension;
      borderRadius?: number;
      size?: undefined;
    }
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  borderRadius = 4,
  type = 'rect',
  size,
  speed = 0.8,
  opacity = 0.2,
  animate = true,
  ...rest
}) => {
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(wrapperWidth, { duration: 1000 / speed }),
        withTiming(-wrapperWidth / 2, { duration: 1000 / speed })
      ),
      -1,
      true
    );
  }, [wrapperWidth, speed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const containerStyle = [
    styles.container,
    type === 'rect'
      ? { width, height, borderRadius }
      : { width: size, height: size, borderRadius: 99 },
    rest,
  ];

  return (
    <View
      style={containerStyle}
      onLayout={(e) => {
        if (e.nativeEvent.layout.width !== 0) {
          setWrapperWidth(e.nativeEvent.layout.width);
        }
      }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          backgroundColor: COLORS.neutral.normal,
          opacity,
        }}
      />
      {animate && (
        <Animated.View
          style={[
            animatedStyle,
            {
              width: type === 'rect' ? '60%' : '75%',
              height: '100%',
              position: 'relative',
            },
          ]}
        >
          <FadingDarkGradient
            stopColor={COLORS.neutral.normal}
            stops={[
              [0, 0],
              [0.5, opacity * 1.5],
              [1, 0],
            ]}
            direction="horizontal"
          />
        </Animated.View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});

export { Skeleton, SkeletonLoader };
