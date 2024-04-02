import { Platform, StatusBar, StyleSheet, ViewProps } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, KeyboardAvoidingView } from 'react-native';
import COLORS from '@/constants/Colors';
import NavBar from './home/NavBar';

interface IContainerProps {
  children: React.ReactNode;
  style?: ViewProps['style'];
  includeNavBar?: boolean;
  statusBarPadding?: boolean;
}

type ContainerPropsWithNavbar = IContainerProps & {
  includeNavBar: true;
  navbarTitle?: string | React.ReactNode;
};

type ContainerPropsWithoutNavbar = IContainerProps & {
  includeNavBar?: false;
  navbarTitle?: never;
};

type ContainerProps = ContainerPropsWithNavbar | ContainerPropsWithoutNavbar;

const Container = ({
  children,
  style,
  includeNavBar = false,
  navbarTitle,
  statusBarPadding = true,
  ...rest
}: ContainerProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={[
          `${COLORS.background.dense}90`,
          `${COLORS.background.dense}80`,
          `${COLORS.background.dense}40`,
          COLORS.background.dense,
        ]}
        style={styles.gradient}
      >
        <SafeAreaView
          style={[
            styles.container,
            statusBarPadding && styles.statusBarPadding,
            style,
          ]}
          {...rest}
        >
          {includeNavBar && <NavBar title={navbarTitle} />}
          {children}
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  statusBarPadding: {
    paddingTop: Platform.OS === 'android' ? StatusBar?.currentHeight || 0 : 0,
  },
});

export default Container;
