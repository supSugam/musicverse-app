import { View } from 'react-native';
import React, { createContext, useContext, useMemo, useState } from 'react';
import COLORS from '@/constants/Colors';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { Drawer } from 'react-native-drawer-layout';
import ImageDisplay from '../reusables/ImageDisplay';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { DEFAULT_AVATAR } from '@/utils/constants';
import StyledText from '../reusables/StyledText';
import { capitalizeFirstLetter } from '@/utils/helpers/string';
import AnimatedTouchable from '../reusables/AnimatedTouchable';
import SidebarNavlink, { HrefType } from './SidebarNavLink';
import { FontAwesome } from '@expo/vector-icons';

interface IAppSidebarLink {
  href: HrefType;
  title: string;
  icon: keyof (typeof FontAwesome)['glyphMap'];
  onPress?: () => void;
}

const ProfileSidebar = () => {
  const { currentUserProfile, currentUser } = useAuthStore();
  // profile,settings, notifications, logout,
  const appSidebarLinks: IAppSidebarLink[] = [
    {
      href: {
        pathname: '/profile/[username]',
        params: {
          username: currentUser?.username || '',
        },
      },
      title: 'Profile',
      icon: 'user',
    },
    // {
    //   href: '',
    //   title: 'Settings',
    //   icon:<MaterialIcons name="settings" size={28} color={COLORS.neutral.normal} style={{ marginRight: 10 }} />,
    // },
    // {
    //   href: 'x',
    //   title: 'Notifications',
    //   icon:<MaterialIcons name="notifications" size={28} color={COLORS.neutral.normal} style={{ marginRight: 10 }} />,
    // },
    // {
    //   href: '',
    //   title: 'Logout',
    //   icon:<MaterialIcons name="logout" size={28} color={COLORS.neutral.normal} style={{ marginRight: 10 }} />,
    // },
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
      <PrimaryGradient opacity={0.05} />
      <View className="flex flex-col w-full h-full px-4 py-20">
        <AnimatedTouchable
          wrapperClassName="w-full flex flex-row items-center py-6"
          style={{
            width: '100%',
          }}
        >
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
            <StyledText size="base" weight="semibold" tracking="tighter">
              {currentUserProfile?.name}
            </StyledText>
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
              // !remindMe 55x55
              key={link.title + index}
              duration={100 * index}
              wrapperClassName="w-full"
              wrapperStyles={{
                width: '100%',
              }}
              onPress={onPress}
            >
              <SidebarNavlink {...rest} borderTop={index === 0} borderBottom />
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
  const [appSidebarOpen, setAppSidebarOpen] = useState<boolean>(true);

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
      renderDrawerContent={() => <ProfileSidebar />}
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

export { ProfileSidebar, AppSidebarDrawer, useAppSidebar };
