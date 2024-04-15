import StyledText from './StyledText';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
import AnimatedTouchable from './AnimatedTouchable';
import BackButton from './BackButton';
import COLORS from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useState } from 'react';
export interface IBackNavigatorProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  showBackText?: boolean;
  title?: string;
  backgroundColor?: string;
  iconSize?: number;
  rightComponent?: React.ReactNode;
  backgroundOpacity?: number;
  borderBottom?: boolean;
}
const BackNavigator = ({
  showBackText = false,
  title = '',
  backgroundColor,
  iconSize = 36,
  rightComponent,
  backgroundOpacity = 0.5,
  borderBottom,
  ...props
}: IBackNavigatorProps) => {
  const { style, onLayout, ...rest } = props;
  const navigation = useNavigation();

  const bgOpacity = useSharedValue(backgroundOpacity);

  const backgroundViewAnimatedStyle = useAnimatedStyle(() => {
    bgOpacity.value = withTiming(backgroundOpacity, { duration: 200 });
    return {
      opacity: bgOpacity.value,
    };
  }, [backgroundOpacity]);

  const [height, setHeight] = useState<number>(0);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ width: '100%' }}
      className="flex flex-row items-center w-full relative"
      onLayout={(e) => {
        onLayout?.(e);
        if (e.nativeEvent.layout.height !== 0) {
          setHeight(e.nativeEvent.layout.height);
        }
      }}
      {...rest}
    >
      <View
        onLayout={({ nativeEvent: { layout } }) => {
          console.log(layout);
        }}
        className="flex flex-row items-center w-full relative"
        style={[
          {
            paddingHorizontal: 8,
            paddingVertical: 8,
            zIndex: 10,
          },
          style,
        ]}
      >
        <AnimatedTouchable
          disableInitialAnimation
          onPress={() => navigation.goBack()}
        >
          <BackButton iconSize={iconSize} showBackText={showBackText} />
        </AnimatedTouchable>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <StyledText weight="bold" size="lg" color={COLORS.neutral.light}>
            {title}
          </StyledText>
        </View>

        <View style={{ position: 'absolute', right: 0 }}>{rightComponent}</View>
      </View>
      <Animated.View
        style={[
          backgroundViewAnimatedStyle,
          {
            position: 'absolute',
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            height,
            ...(backgroundColor && { backgroundColor }),
            zIndex: 1,
            borderBottomColor: COLORS.neutral.semidark,
            borderBottomWidth: borderBottom ? 1 : 0,
          },
        ]}
      />
      {/* Background */}
    </TouchableOpacity>
  );
};

export default BackNavigator;
