import { View } from 'react-native';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import COLORS from '@/constants/Colors';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { Drawer } from 'react-native-drawer-layout';
import ImageDisplay from '../reusables/ImageDisplay';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { DEFAULT_AVATAR } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import { capitalizeFirstLetter } from '@/utils/helpers/string';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import SidebarNavlink from './SidebarNavLink';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import ReusableAlert from '../reusables/ReusableAlert';
import LottieView from 'lottie-react-native';
import { MembershipCrownLA } from '@/assets/lottie';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { UserRole } from '@/utils/Interfaces/IUser';
import { CallbackType } from '@/utils/enums/CallbackType';
import { toastResponseMessage } from '@/utils/toast';

export interface IAppSidebarLink {
  title: string;
  icon?: keyof (typeof FontAwesome)['glyphMap'];
  onPress?: () => void;
  options?: IAppSidebarLink[];
}

const AppSidebar = ({
  toggleAppSidebar,
  appSidebarOpen,
}: AppSidebarContextType & { appSidebarOpen: boolean }) => {
  const { currentUserProfile, currentUser, logout, initiateResetPassword } =
    useAuthStore();
  const navigation = useNavigation();

  const crownRotate = useSharedValue(0);
  const crownScale = useSharedValue(0);

  const crownAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${crownRotate.value}deg` },
        { scale: crownScale.value },
      ],
    };
  });

  useEffect(() => {
    if (
      currentUser?.role === UserRole.MEMBER ||
      currentUser?.role === UserRole.ARTIST
    ) {
      if (appSidebarOpen) {
        crownRotate.value = withTiming(360 - 35, { duration: 1000 });
        crownScale.value = withTiming(1.1, { duration: 1000 });
      } else {
        crownRotate.value = withTiming(0, { duration: 1000 });
        crownScale.value = withTiming(0, { duration: 1000 });
      }
    }
  }, [appSidebarOpen, currentUser]);

  const [logOutAlert, setLogOutAlert] = useState<boolean>(false);
  // profile,settings, notifications, logout,
  const appSidebarLinks: IAppSidebarLink[] = [
    {
      title: 'Profile',
      icon: 'user',
      onPress: () => {
        toggleAppSidebar();
        navigation.dispatch(
          CommonActions.navigate({
            name: 'ProfilePage',
            params: { username: currentUser?.username || '' },
          })
        );
      },
    },
    {
      title: 'Settings',
      icon: 'cog',
      onPress: () => {
        // toggleAppSidebar();
        // navigation.dispatch(
        //   CommonActions.navigate({
        //     name: 'SettingsPage',
        //   })
        // );
      },
      options: [
        {
          title: 'Reset Password',
          onPress: () => {
            if (!currentUser?.email) return;
            toggleAppSidebar();
            initiateResetPassword(currentUser?.email);
            toastResponseMessage({
              type: 'info',
              content: 'Please check your email for the OTP.',
            });
            (navigation as any).navigate('OTPVerification', {
              email: currentUser?.email,
              onVerifiedCallback: CallbackType.RESET_PASSWORD,
            });
          },
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'bell',
      onPress: () => {
        toggleAppSidebar();
        navigation.dispatch(
          CommonActions.navigate({
            name: 'NotificationsPage',
          })
        );
      },
    },
    {
      title: 'Become a Member',
      icon: 'user-plus',
      onPress: () => {
        toggleAppSidebar();
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Membership',
          })
        );
      },
    },
    {
      title: 'Sign Out',
      icon: 'sign-out',
      onPress: () => {
        setLogOutAlert(true);
      },
    },
  ];
  return (
    <View
      className="flex relative"
      style={{
        backgroundColor: COLORS.neutral.dense,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        borderRightColor: COLORS.neutral.semidark,
        borderRightWidth: 1,

        // nice drop shadow
      }}
    >
      <ReusableAlert
        cancelText="Cancel"
        confirmText="Sign Out"
        visible={logOutAlert}
        onClose={() => setLogOutAlert(false)}
        onConfirm={() => {
          setLogOutAlert(false);
          toggleAppSidebar();
          logout();
        }}
        type="alert"
        header="Sign Out"
      >
        <StyledText size="lg" weight="semibold" className="text-left">
          Are you sure you want to sign out?
        </StyledText>
      </ReusableAlert>
      <PrimaryGradient opacity={0.05} />
      <View className="flex flex-col w-full h-full px-4 py-20">
        <AnimatedTouchable
          wrapperClassName="w-full flex flex-row items-center py-6 relative"
          style={{
            width: '100%',
          }}
        >
          <Animated.View
            className="absolute top-2 -left-1 z-10"
            style={crownAnimatedStyle}
          >
            <LottieView
              source={MembershipCrownLA}
              autoPlay
              loop
              speed={0.25}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Animated.View>

          <ImageDisplay
            source={
              currentUserProfile?.avatar
                ? { uri: currentUserProfile?.avatar }
                : DEFAULT_AVATAR
            }
            height={60}
            width={60}
            borderRadius="full"
          />
          <View className="flex flex-col ml-4">
            <View className="flex flex-row items-center">
              <StyledText
                size="base"
                weight="semibold"
                tracking="tight"
                style={{
                  marginRight: 3,
                }}
              >
                {currentUserProfile?.name}
              </StyledText>
              {currentUser?.role === UserRole.ARTIST && (
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.neutral.white}
                />
              )}
            </View>

            <StyledText
              size="base"
              color={COLORS.neutral.light}
              tracking="tighter"
            >
              {capitalizeFirstLetter(currentUser?.role || '')}
            </StyledText>
          </View>
        </AnimatedTouchable>

        {appSidebarLinks.map((link, index) => {
          const { onPress, ...rest } = link;
          return (
            <AnimatedTouchable
              key={link.title + index}
              duration={100 * index}
              wrapperStyles={{
                width: '100%',
              }}
              style={{
                width: '100%',
              }}
              onPress={onPress}
            >
              <SidebarNavlink
                {...rest}
                borderTop={index === 0}
                borderBottom
                key={link.title + index}
              />
            </AnimatedTouchable>
          );
        })}
      </View>
    </View>
  );
};

interface AppSidebarContextType {
  openAppSidebar: () => void;
  closeAppSidebar: () => void;
  toggleAppSidebar: () => void;
}

const AppSiderbarContext = createContext<AppSidebarContextType | undefined>(
  undefined
);

const AppSidebarDrawer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appSidebarOpen, setAppSidebarOpen] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      openAppSidebar: () => setAppSidebarOpen(true),
      closeAppSidebar: () => setAppSidebarOpen(false),
      toggleAppSidebar: () => setAppSidebarOpen((prev) => !prev),
    }),
    []
  );

  return (
    <Drawer
      open={appSidebarOpen}
      onOpen={() => setAppSidebarOpen(true)}
      onClose={() => setAppSidebarOpen(false)}
      drawerPosition="left"
      renderDrawerContent={() => (
        <AppSidebar {...{ ...value, appSidebarOpen }} />
      )}
      drawerType="slide"
    >
      <AppSiderbarContext.Provider value={value}>
        {children}
      </AppSiderbarContext.Provider>
    </Drawer>
  );
};

const useAppSidebar = (): AppSidebarContextType => {
  const context = useContext(AppSiderbarContext);
  if (!context) {
    throw new Error('useAppSidebar must be used within an AppSidebarDrawer');
  }
  return context;
};

export { AppSidebar, AppSidebarDrawer, useAppSidebar };
