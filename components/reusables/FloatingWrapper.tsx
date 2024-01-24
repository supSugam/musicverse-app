import COLORS from '@/constants/Colors';
import { View, Text, ViewBase, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Rect,
} from 'react-native-svg';

type IFloatingWrapperProps = View['props'] & {
  children: React.ReactNode;
};

const FloatingWrapper = ({ children, ...rest }: IFloatingWrapperProps) => {
  return (
    <View
      className=" min-w-full flex items-center justify-center overflow-hidden relative rounded-2xl"
      {...rest}
    >
      <Svg
        height="100%"
        width="100%"
        className=" py-8 min-w-full rounded-2xl"
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="40%" fx="50%" fy="50%">
            <Stop
              offset="0%"
              stopColor={COLORS.background.dense}
              stopOpacity="1"
            />
            <Stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#grad)"
          fillOpacity="0.5"
        />
      </Svg>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Centered text</Text>
      </View>
    </View>
  );
};

export default FloatingWrapper;
