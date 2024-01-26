import { View } from 'react-native';
import { Image } from 'expo-image';
import StyledText from './StyledText';

type LogoWithNameProps = React.ComponentProps<typeof View> & {
  discludeName?: boolean;
};

export default function LogoWithName({
  className,
  discludeName = false,
  ...rest
}: LogoWithNameProps) {
  return (
    <View className={`flex flex-row items-center gap-3 ${className}`} {...rest}>
      <Image
        source={require('@/assets/images/logo.png')}
        contentFit="cover"
        transition={300}
        style={{
          width: 40,
          height: 40,
          alignSelf: 'center',
          transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
        }}
      />
      {!discludeName && (
        <StyledText
          weight="bold"
          tracking="tighter"
          size="3xl"
          className="text-violet-300"
        >
          MusicVerse
        </StyledText>
      )}
    </View>
  );
}
