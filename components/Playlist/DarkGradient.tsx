import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const DarkGradient = () => {
  return (
    <LinearGradient
      colors={[COLORS.neutral.black, COLORS.neutral.dark, COLORS.neutral.dense]}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        opacity: 0.15,
        flex: 1,
        top: 0,
        left: 0,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

export default DarkGradient;
