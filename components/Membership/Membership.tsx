import { Pressable, StyleSheet, Touchable } from 'react-native';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import COLORS from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackNavigator from '../reusables/BackNavigator';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MEMBERSHIP_BENEFITS, MEMBERSHIP_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import { View } from 'react-native';
import { MembershipCrownLA } from '@/assets/lottie';
import LottieView from 'lottie-react-native';
import { StyledButton } from '../reusables/StyledButton';
import { MaterialIcons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import { toastResponseMessage } from '@/utils/toast';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import { capitalizeFirstLetter } from '@/utils/helpers/string';
import { SuccessResponse } from '@/utils/Interfaces/IApiResponse';

type PurchaseMode = 'Member' | 'Artist';
const Membership = () => {
  const { api, refreshToken } = useAuthStore();

  // purchase-membership
  const purchaseMembershipMutation = useMutation<
    AxiosResponse<SuccessResponse<{ message: string; membership: any }>>
  >({
    mutationFn: async () => await api.post('/users/purchase-membership'),
    onSuccess: (data) => {
      toastResponseMessage({
        type: 'success',
        content:
          data.data.result.message || 'Membership purchased successfully!',
      });
      refreshToken();
    },
    onError: (error) => {
      toastResponseMessage({
        type: 'error',
        content: error,
      });
    },
  });

  const applyToBecomeArtistMutation = useMutation<
    AxiosResponse<SuccessResponse<{ message: string }>>
  >({
    mutationFn: async () => await api.post('/users/apply-artist'),
    onSuccess: (data) => {
      toastResponseMessage({
        type: 'success',
        content: data.data.message || 'Application submitted successfully!',
      });
    },
    onError: (error) => {
      toastResponseMessage({
        type: 'error',
        content: error,
      });
    },
  });

  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('Member');

  const onMembershipPress = async () => {
    if (purchaseMode === 'Artist') {
      applyToBecomeArtistMutation.mutate();
    } else {
      purchaseMembershipMutation.mutate();
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: COLORS.neutral.dense,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <PrimaryGradient
        style={{
          height: '150%',
        }}
      />
      <BackNavigator
        title="Membership"
        backgroundColor={COLORS.neutral.dense}
        style={{
          borderColor: COLORS.neutral.semidark,
          borderBottomWidth: 1,
        }}
      />
      <View
        style={{
          height: 160,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.Image
          source={MEMBERSHIP_IMAGE}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 10,
            borderRadius: 4,
            backgroundColor: COLORS.neutral.semidark,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 6,
          }}
        >
          {['Member', 'Artist'].map((type, index) => (
            <Pressable
              key={index}
              onPress={(e) => {
                setPurchaseMode(type as PurchaseMode);
              }}
              style={{
                marginRight: index === 0 ? 10 : 0,
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderBottomWidth: 1,
                ...(purchaseMode === type && {
                  backgroundColor: COLORS.neutral.light,
                }),
                borderRadius: 4,
              }}
            >
              <StyledText
                size="base"
                weight={purchaseMode === type ? 'extrabold' : 'normal'}
                color={
                  purchaseMode === type
                    ? COLORS.primary.purple
                    : COLORS.neutral.light
                }
              >
                {capitalizeFirstLetter(type)}
              </StyledText>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="w-full px-4 pt-3 flex flex-col items-center">
        <LottieView
          source={MembershipCrownLA}
          autoPlay
          loop
          speed={0.25}
          style={{
            width: 60,
            height: 60,
            transform: [{ scale: 1.2 }],
          }}
        />
        <View className="relative w-full flex items-center justify-center mt-2">
          <StyledText size="4xl" weight="semibold" tracking="tighter">
            Premium Membership
          </StyledText>
          <StyledText
            size="base"
            className="text-center mt-3"
            color={COLORS.neutral.light}
          >
            Enjoy the best of our services by upgrading to premium membership!
          </StyledText>
        </View>

        <View className="w-full flex flex-row items-center justify-center mt-7">
          <StyledText size="xl" weight="extralight" tracking="tighter">
            Rs.
          </StyledText>
          <StyledText
            size="5xl"
            weight="bold"
            tracking="tighter"
            className="mx-1"
          >
            399
          </StyledText>
          <StyledText size="xl" weight="extralight" tracking="tighter">
            /month
          </StyledText>
        </View>

        <View className="w-full flex flex-col items-center justify-center mt-4">
          {MEMBERSHIP_BENEFITS(purchaseMode === 'Artist').map(
            (benefit, index) => (
              <MembershipBenefit key={index} benefit={benefit} />
            )
          )}
        </View>

        <StyledButton
          onPress={onMembershipPress}
          fullWidth
          className="mt-4 self-end"
        >
          <StyledText size="xl" weight="semibold">
            Upgrade Now
          </StyledText>
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

export default Membership;

const MembershipBenefit = ({ benefit }: { benefit: string }) => {
  return (
    <View className="flex flex-row items-center w-full mb-2">
      <MaterialIcons
        name="check"
        size={24}
        color={COLORS.primary.light}
        style={{
          paddingRight: 10,
        }}
      />
      <StyledText size="base" color={COLORS.neutral.light}>
        {benefit}
      </StyledText>
    </View>
  );
};
