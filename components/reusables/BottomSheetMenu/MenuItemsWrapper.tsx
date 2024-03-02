import COLORS from '@/constants/Colors';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Text, Touchable, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StyledText from '../StyledText';

interface IMenuItemsWrapperProps {
  children: React.ReactNode;
  draggable?: boolean;
  header?: string | React.ReactNode;
}

const MenuItemsWrapper = ({
  children,
  header,
  draggable,
}: IMenuItemsWrapperProps) => {
  const wrapperTranslateY = useSharedValue(400);

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: wrapperTranslateY.value }],
    };
  });

  const conditionalHeader = useMemo(() => {
    if (!header) return null;
    if (typeof header === 'string') {
      return (
        <StyledText size="xl" weight="bold">
          {header}
        </StyledText>
      );
    }
    if (React.isValidElement(header)) {
      return header;
    }
  }, [header]);

  useEffect(() => {
    wrapperTranslateY.value = 0;
  }, []);
  return (
    <Animated.View style={[styles.mainWrapper, wrapperAnimatedStyle]}>
      <TouchableOpacity activeOpacity={0.7} containerStyle={{ width: '100%' }}>
        <View
          style={{
            height: 4,
            width: 40,
            backgroundColor: 'white',
            marginVertical: 10,
            borderRadius: 5,
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
      {conditionalHeader && (
        <View style={styles.headerWrapper}>{conditionalHeader}</View>
      )}
      <ScrollView style={styles.scrollViewWrapper}>{children}</ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    width: '100%',
    backgroundColor: COLORS.neutral.semidark,
    paddingHorizontal: 4,
    paddingVertical: 12,
    maxHeight: 500,
  },
  scrollViewWrapper: {
    width: '100%',
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});

export default MenuItemsWrapper;
