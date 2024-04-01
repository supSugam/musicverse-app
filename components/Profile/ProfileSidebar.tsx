import { View } from 'react-native';
import React, { createContext, useContext, useMemo, useState } from 'react';
import COLORS from '@/constants/Colors';
import PrimaryGradient from '../reusables/Gradients/PrimaryGradient';
import { Drawer } from 'react-native-drawer-layout';

const ProfileSidebar = () => {
  return (
    <View
      className="flex relative"
      style={{
        backgroundColor: COLORS.neutral.dense,
        borderRadius: 16,
        height: '100%',
        width: '80%',
        justifyContent: 'center',
        display: 'flex',
        paddingVertical: 20,
      }}
    >
      <PrimaryGradient
        opacity={0.1}
        style={{
          borderRadius: 16,
        }}
      />
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
      drawerPosition="right"
      renderDrawerContent={() => <ProfileSidebar />}
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
