import COLORS from '@/constants/Colors';
import { useEffect, useMemo, useState } from 'react';
import { ImageColorsResult, getColors } from 'react-native-image-colors';

const useImageColors = (imageSrc?: string | null) => {
  const [colors, setColors] = useState<ImageColorsResult | null>(null);

  const averageColor = useMemo(() => {
    switch (colors?.platform) {
      case 'android':
        return colors.average;
      case 'web':
        return colors.vibrant;
      case 'ios':
        return colors.primary;
      default:
        return COLORS.neutral.semidark;
    }
  }, [colors]);

  useEffect(() => {
    if (!imageSrc) return;
    getColors(imageSrc, {
      fallback: COLORS.neutral.semidark,
      cache: true,
      key: imageSrc,
    }).then((colors) => {
      setColors(colors);
    });
  }, [imageSrc]);

  return { colors, averageColor };
};

export default useImageColors;
