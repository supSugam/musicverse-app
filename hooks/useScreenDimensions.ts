// useScreenDimensions.ts

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export default function useScreenDimensions() {
  const [screenData, setScreenData] = useState<ScaledSize>(
    Dimensions.get('screen')
  );

  useEffect(() => {
    const onChange = ({
      window,
      screen,
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => {
      setScreenData(screen);
    };

    Dimensions.addEventListener('change', onChange);
  });

  return {
    SCREEN_WIDTH: screenData.width,
    SCREEN_HEIGHT: screenData.height,
    scale: screenData.scale,
    fontScale: screenData.fontScale,
  };
}
