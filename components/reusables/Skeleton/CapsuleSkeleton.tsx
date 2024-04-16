import { View } from 'react-native';
import React from 'react';
import { SkeletonLoader } from './Skeleton';

interface ICapsuleSkeletonProps extends React.ComponentProps<typeof View> {
  numbers?: number;
}
const CapsuleSkeleton = ({ numbers = 3, ...rest }: ICapsuleSkeletonProps) => {
  return (
    <View className="flex flex-row my-4 overflow-hidden" {...rest}>
      {[...Array(numbers)].map((_, index) => (
        <SkeletonLoader
          key={index}
          type="rect"
          height={25}
          width={Math.floor(Math.random() * 41) + 50}
          borderRadius={8}
          opacity={0.3}
          marginRight={12}
        />
      ))}
    </View>
  );
};

export default CapsuleSkeleton;
