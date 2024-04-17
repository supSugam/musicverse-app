import { StyleSheet } from 'react-native';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import COLORS from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackNavigator from '../reusables/BackNavigator';
import Animated from 'react-native-reanimated';
import { MEMBERSHIP_BENEFITS, MEMBERSHIP_IMAGE } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import { View } from 'react-native';
import { MembershipCrownLA } from '@/assets/lottie';
import LottieView from 'lottie-react-native';
import { StyledButton } from '../reusables/StyledButton';
import { MaterialIcons } from '@expo/vector-icons';

const Membership = () => {
  const onMembershipPress = async () => {
    try {
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PrimaryGradient opacity={0.15} />
      <BackNavigator
        title="Membership"
        backgroundColor={COLORS.neutral.dense}
        style={{
          borderColor: COLORS.neutral.semidark,
          borderBottomWidth: 1,
        }}
      />
      <Animated.Image
        source={MEMBERSHIP_IMAGE}
        style={{
          width: '100%',
          height: 160,
        }}
      />
      <View className="w-full px-6 py-3 flex flex-col items-center">
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
          {MEMBERSHIP_BENEFITS.map((benefit, index) => (
            <MembershipBenefit key={index} benefit={benefit} />
          ))}
        </View>

        <StyledButton onPress={onMembershipPress} fullWidth className="mt-4">
          <StyledText size="xl" weight="semibold">
            Upgrade Now
          </StyledText>
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.neutral.dense,
  },
});

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
