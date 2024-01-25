import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type StyledButtonProps = {
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
    ...rest
  } = props;
  return (
    <Pressable
      onPress={onPress}
      className={`
    ${fullWidth ? 'w-full' : ''}
    `}
      {...rest}
    >
      <LinearGradient
        className={`flex justify-center items-center px-6 py-3 rounded-md ${
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
        {children}
      </LinearGradient>
    </Pressable>
  );
}
