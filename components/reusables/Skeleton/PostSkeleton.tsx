import { View } from 'react-native';
import React from 'react';
import { SkeletonLoader } from './Skeleton';
import CapsuleSkeleton from './CapsuleSkeleton';

const PostSkeleton = ({ numbers = 1 }: { numbers: number }) => {
  return (
    <View className="w-full flex-col my-3">
      {[...Array(numbers)].map((_, index) => (
        <View key={index} className="flex flex-col w-full mb-8">
          <View className="w-full flex flex-row items-center">
            <SkeletonLoader type="circle" size={40} />
            <View className="flex flex-col ml-3 flex-1">
              <SkeletonLoader
                type="rect"
                height={15}
                flex={1}
                opacity={0.3}
                marginBottom={12}
              />
              <SkeletonLoader type="rect" height={10} flex={1} />
            </View>
          </View>

          <View className="w-full flex flex-row justify-between items-end mt-4">
            <CapsuleSkeleton numbers={3} />
            <SkeletonLoader type="rect" height={60} width={60} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default PostSkeleton;
