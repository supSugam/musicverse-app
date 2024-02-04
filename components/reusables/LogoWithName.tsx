import { View } from 'react-native';
import { Image } from 'expo-image';
import StyledText from './StyledText';

type LogoWithNameProps = React.ComponentProps<typeof View> & {
  discludeName?: boolean;
  width?: number;
  height?: number;
  title?: React.ReactNode;
};

export default function LogoWithName({
  className,
  discludeName = false,
  width = 60,
  height = 60,
  title,
  ...rest
}: LogoWithNameProps) {
  return (
    <View
      className={`flex flex-row items-center justify-center ${className}`}
      {...rest}
    >
      <Image
        source={require('@/assets/images/logo.png')}
        contentFit="cover"
        transition={200}
        style={{
          width,
          height,
          alignSelf: 'center',
        }}
      />
      <View>
        {!discludeName &&
          (title ? (
            title
          ) : (
            <StyledText
              weight="bold"
              tracking="tighter"
              size="3xl"
              className="text-violet-300"
            >
              MusicVerse
            </StyledText>
          ))}
      </View>
    </View>
  );
}
