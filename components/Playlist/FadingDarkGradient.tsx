import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Defs, Rect, Stop, Svg, LinearGradient } from 'react-native-svg';

const defaultStops: GradientStop[] = [
  [0, 0.9],
  [0.3, 0.3],
  [0.8, 0.9],
  [1, 1],
];
type GradientStop = [`${number}` | number, `${number}` | number];
interface IFadingDarkGradientProps extends React.ComponentProps<typeof View> {
  opacity?: number;
  stops?: GradientStop[];
  stopColor?: string;
  direction?: 'horizontal' | 'vertical';
}

const FadingDarkGradient = ({
  opacity = 1,
  stops = defaultStops,
  stopColor = 'rgb(0,0,0)',
  ...rest
}: IFadingDarkGradientProps) => {
  const [layout, setLayout] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const { style, ...otherProps } = rest;
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          opacity,
          width: '100%',
          height: '100%',
        },
        style,
      ]}
      onLayout={({ nativeEvent: { layout } }) => {
        if (layout.width !== 0 && layout.height !== 0) {
          setLayout(layout);
        }
      }}
      {...otherProps}
    >
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient
            id="grad"
            {...(rest.direction === 'horizontal'
              ? { x1: 0, y1: 0, x2: 1, y2: 0 }
              : { x1: 0, y1: 0, x2: 0, y2: 1 })}
          >
            {stops.map(([offset, stopOpacity], index) => (
              <Stop
                key={index}
                offset={offset}
                stopOpacity={stopOpacity}
                stopColor={stopColor}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={layout.width}
          height={layout.height}
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
};

export default FadingDarkGradient;
