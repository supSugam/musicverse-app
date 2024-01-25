import { StyleSheet } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native';
import COLORS from '@/constants/Colors';

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient
      colors={[COLORS.background.dark, COLORS.background.dense]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default Container;
