import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator } from 'react-native';

type StyledButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
  onPress: () => void;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
} & React.ComponentProps<typeof Pressable>;

export default function StyledButton(props: StyledButtonProps) {
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
            : ['#372648', '#342647']
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
