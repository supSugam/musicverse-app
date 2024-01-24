// useScreenDimensions.ts

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export default function useScreenDimensions(): ScaledSize {
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

  return screenData;
}
