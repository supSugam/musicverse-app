import StyledText from './StyledText';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'expo-router';
import AnimatedTouchable from './AnimatedTouchable';
import BackButton from './BackButton';
import COLORS from '@/constants/Colors';
export interface IBackNavigatorProps extends React.ComponentProps<typeof View> {
  showBackText?: boolean;
  title?: string;
  backgroundColor?: string;
  iconSize?: number;
  rightComponent?: React.ReactNode;
}
const BackNavigator = ({
  showBackText = false,
  title = '',
  backgroundColor,
  iconSize = 36,
  rightComponent,
  ...props
}: IBackNavigatorProps) => {
  const { style, ...rest } = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex flex-row items-center w-full relative"
      style={[
        {
          paddingHorizontal: 8,
          paddingVertical: 8,
          ...(backgroundColor && { backgroundColor }),
        },
        style,
      ]}
      onPress={() => navigation.goBack()}
    >
      <AnimatedTouchable disableInitialAnimation>
        <BackButton iconSize={iconSize} showBackText={showBackText} />
      </AnimatedTouchable>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        }}
      >
        <StyledText weight="bold" size="lg" color={COLORS.neutral.light}>
          {title}
        </StyledText>
      </View>

      <View style={{ position: 'absolute', right: 0 }}>{rightComponent}</View>
    </TouchableOpacity>
  );
};

export default BackNavigator;
