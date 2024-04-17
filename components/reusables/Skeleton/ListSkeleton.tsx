import { View } from 'react-native';
import React from 'react';
import { SkeletonLoader } from './Skeleton';

const ListSkeleton = ({ numbers = 1 }: { numbers: number }) => {
  return (
    <>
      {[...Array(numbers)].map((_, index) => (
        <View
          key={index}
          className="flex flex-row justify-between items-center w-full my-3"
        >
          <SkeletonLoader type="rect" width={50} height={50} borderRadius={4} />
          <View className="flex flex-col ml-3 flex-1">
            <SkeletonLoader
              type="rect"
              height={25}
              opacity={0.3}
              marginBottom={12}
            />
            <SkeletonLoader type="rect" height={15} flex={1} />
          </View>
        </View>
      ))}
    </>
  );
};

export default ListSkeleton;
