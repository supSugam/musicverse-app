import { View } from 'react-native';
import React from 'react';
import { ISVGIconProps } from '@/utils/Interfaces/ISVGIconProps';
import StyledText from '@/components/reusables/StyledText';
import Svg, { Path } from 'react-native-svg';
interface ISkipIconProps extends ISVGIconProps {
  skipSeconds: `${number}s`;
  skipType: 'forward' | 'backward';
}

const SkipIcon = ({ skipSeconds, skipType }: ISkipIconProps) => {
  return (
    <View className="relative flex">
      <StyledText
        size="xs"
        weight="bold"
        style={{
          position: 'absolute',
          bottom: -4,
          ...(skipType === 'forward' ? { right: '10%' } : { left: '10%' }),
        }}
      >
        {skipSeconds}
      </StyledText>
      <View className="absolute top-0 left-0 flex items-center justify-center">
        <Svg
          width={39}
          height={29}
          viewBox="0 0 39 29"
          fill="none"
          scaleX={skipType === 'backward' ? 1 : -1}
        >
          <Path
            d="M0.179655 8.42888C-0.135733 8.88226 -0.0238726 9.50546 0.429502 9.82085L7.81767 14.9604C8.27105 15.2758 8.89425 15.1639 9.20964 14.7106C9.52503 14.2572 9.41317 13.634 8.95979 13.3186L2.39253 8.7501L6.96102 2.18284C7.27641 1.72946 7.16455 1.10626 6.71117 0.790867C6.2578 0.475479 5.63459 0.587339 5.3192 1.04071L0.179655 8.42888ZM29.3897 27.9564C31.9354 22.992 32.7943 18.9354 32.1442 15.694C31.4811 12.3872 29.2914 10.1295 26.2313 8.71707C23.2054 7.32045 19.2797 6.71953 14.9407 6.67192C10.5871 6.62415 5.74066 7.13316 0.823894 8.01567L1.17723 9.98422C6.01005 9.11676 10.7258 8.6258 14.9188 8.6718C19.1264 8.71797 22.7317 9.30458 25.3932 10.533C28.0205 11.7456 29.6745 13.5504 30.1833 16.0873C30.7052 18.6897 30.0641 22.2581 27.61 27.0438L29.3897 27.9564Z"
            fill="white"
          />
        </Svg>
      </View>
    </View>
  );
};

export default SkipIcon;
