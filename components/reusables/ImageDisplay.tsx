import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from './StyledText';

interface IImageDisplayProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  source: string | null;
  placeholder: string;
  width?: number;
  height?: number;
  borderRadius?: 'full' | number;
  onPress?: () => void;
}

const ImageDisplay = ({
  source,
  placeholder,
  width = 100,
  height = 100,
  borderRadius = 4,
  onPress,
  ...rest
}: IImageDisplayProps) => {
  const borderRadiusStyle =
    borderRadius === 'full'
      ? { borderRadius: Math.min(width, height) / 2 }
      : { borderRadius };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} {...rest}>
      <LinearGradient
        colors={[
          COLORS.neutral.black,
          COLORS.neutral.dark,
          COLORS.neutral.dense,
        ]}
        style={[styles.container, { width, height }, borderRadiusStyle]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {source ? (
          <Image
            source={{ uri: source }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <StyledText size="2xl" weight="bold" className="text-center">
            {placeholder}
          </StyledText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.neutral.dark}80`,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default ImageDisplay;
