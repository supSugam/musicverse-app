import { Pressable, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native';
import COLORS from '@/constants/Colors';
import { StyleSheet } from 'react-native';

type StyledButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
  onPress: () => void;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
} & React.ComponentProps<typeof Pressable>;

export function StyledButton(props: StyledButtonProps) {
  const {
    children,
    onPress,
    fullWidth = false,
    variant = 'primary',
    loading = false,
    ...rest
  } = props;

  return (
    <Pressable
      onPress={onPress}
      className={`
    ${fullWidth ? 'w-full' : ''}
    `}
      {...rest}
      disabled={loading}
    >
      <LinearGradient
        style={{
          minHeight: 59,
          overflow: 'hidden',
        }}
        className={`flex justify-center items-center px-6 py-2 rounded-md ${
          fullWidth ? 'w-full' : ''
        }`}
        colors={
          variant === 'primary'
            ? ['#b11fc8', '#5b21b6']
            : [COLORS.neutral.dark, COLORS.neutral.dense, COLORS.neutral.dark]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {loading && <ActivityIndicator size="large" color="#ffffff" />}
        {!loading && children}
      </LinearGradient>
    </Pressable>
  );
}

interface IStyledTouchableOpacityProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  children: React.ReactNode;
}

export const StyledTouchableOpacity = ({
  children,
  ...rest
}: IStyledTouchableOpacityProps) => {
  return (
    <TouchableOpacity
      {...rest}
      style={[styles.root, rest.style]}
      className={`flex flex-row items-center justify-center px-3 py-1 rounded-md ${rest.className}`}
      activeOpacity={rest.activeOpacity || 0.8}
    >
      {children}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.neutral.dark,
    borderColor: COLORS.neutral.normal,
    borderWidth: 1,
  },
});
