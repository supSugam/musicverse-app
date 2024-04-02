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
import SidebarNavlink from './SidebarNavLink';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';

interface IAppSidebarLink {
  title: string;
  icon: keyof (typeof FontAwesome)['glyphMap'];
  onPress?: () => void;
}

const AppSidebar = ({ toggleAppSidebar }: AppSidebarContextType) => {
  const { currentUserProfile, currentUser } = useAuthStore();
  const navigation = useNavigation();
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
      renderDrawerContent={() => <AppSidebar {...value} />}
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
