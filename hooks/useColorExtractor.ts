import COLORS from '@/constants/Colors';
import { useEffect, useMemo, useState } from 'react';
import { ImageColorsResult, getColors } from 'react-native-image-colors';

const useImageColors = (imageSrc?: string | null) => {
  const [colors, setColors] = useState<ImageColorsResult | null>(null);

  const [averageColor, setAverageColor] = useState<string | null>(null);

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

  useEffect(() => {
    if (!colors) return;
    switch (colors?.platform) {
      case 'android':
        setAverageColor(colors.average);
      case 'web':
        setAverageColor(colors.vibrant);
      case 'ios':
      // setAverageColor(colors?.primary);
      default:
        setAverageColor(COLORS.neutral.semidark);
    }
  }, [colors]);

  return { colors, averageColor };
};

export default useImageColors;
