import { View } from 'react-native';
import React from 'react';
import { ISVGIconProps } from '@/utils/Interfaces/ISVGIconProps';
import StyledText from '@/components/reusables/StyledText';
import Svg, { Path } from 'react-native-svg';
import COLORS from '@/constants/Colors';
interface ILoopIconProps extends ISVGIconProps {
  color?: string;
  loopType: 'one' | 'all' | 'off';
  width?: number;
  height?: number;
}

const LoopIcon = ({
  color = COLORS.neutral.light,
  loopType,
  width = 24,
  height = 24,
}: ILoopIconProps) => {
  const fill = loopType === 'off' ? COLORS.neutral.gray : color;
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512" fill={fill}>
      {loopType === 'one' ? (
        <Path
          d="M32 256c-17.7 0-32-14.3-32-32C0 135.6 71.6 64 160 64H320V32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c12.5 12.5 12.5 32.8 0 45.3l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V128H160c-53 0-96 43-96 96c0 17.7-14.3 32-32 32zm448 0c17.7 0 32 14.3 32 32c0 88.4-71.6 160-160 160H192v32c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-64-64c-12.5-12.5-12.5-32.8 0-45.3l64-64c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6v32H352c53 0 96-43 96-96c0-17.7 14.3-32 32-32zM288 216v80c0 13.3-10.7 24-24 24s-24-10.7-24-24V248c-10 0-19.4-6.4-22.8-16.4c-4.2-12.6 2.6-26.2 15.2-30.4l24-8c7.3-2.4
    15.4-1.2 21.6 3.3s10 11.8 10 19.5z"
          fill={fill}
        />
      ) : (
        <Path
          d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"
          fill={fill}
        />
      )}
    </Svg>
  );
};

export default LoopIcon;
