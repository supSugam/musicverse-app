import { View } from 'react-native';
import React from 'react';
import { SkeletonLoader } from './Skeleton';

interface ISquareSkeletonProps extends React.ComponentProps<typeof View> {
  numbers?: number;
}

const SquareSkeleton = ({ numbers = 1, ...rest }: ISquareSkeletonProps) => {
  return (
    <View className="flex flex-row my-4 overflow-hidden" {...rest}>
      {[...Array(numbers)].map((_, index) => (
        <View key={index} className="flex flex-col mr-4">
          <SkeletonLoader
            type="rect"
            height={115}
            width={115}
            borderRadius={4}
          />
          <View className="flex flex-col flex-1">
            <SkeletonLoader
              type="rect"
              height={12}
              width={115}
              borderRadius={4}
              marginTop={8}
            />
            <SkeletonLoader
              type="rect"
              height={8}
              width={115}
              borderRadius={4}
              marginTop={6}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default SquareSkeleton;
