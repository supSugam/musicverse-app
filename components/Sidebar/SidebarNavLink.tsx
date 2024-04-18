import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Href, HrefObject, LinkProps } from 'expo-router';
import COLORS from '@/constants/Colors';
import StyledText from '../reusables/StyledText';
import { FontAwesome } from '@expo/vector-icons';
import { IAppSidebarLink } from './AppSidebar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export type LinkPropsWithoutHref = Omit<LinkProps<string>, 'href'>;
export type HrefString = Href<string>;
export type HrefType = HrefObject<Record<'pathname', HrefString>>;

type ISidebarNavLinkProps = {
  title: string | React.ReactNode;
  icon?: keyof (typeof FontAwesome)['glyphMap'];
  borderTop?: boolean;
  borderBottom?: boolean;
  options?: IAppSidebarLink[];
};
const SidebarNavlink = ({
  title,
  icon,
  borderTop,
  borderBottom,
  options,
}: ISidebarNavLinkProps) => {
  const [optionsExpanded, setOptionsExpanded] = useState<boolean>(false);
  const chevronRotate = useSharedValue(0);
  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${chevronRotate.value}deg` }],
    };
  });

  const optionsHeight = useSharedValue(0);
  const optionsAnimatedStyles = useAnimatedStyle(() => {
    return {
      height: optionsHeight.value,
      overflow: 'hidden',
    };
  });

  useEffect(() => {
    if (optionsExpanded) {
      chevronRotate.value = withTiming(90);
      if (options) {
        optionsHeight.value = withTiming(50 * options.length);
      }
    } else {
      chevronRotate.value = withTiming(0);
      optionsHeight.value = withTiming(0);
    }
  }, [optionsExpanded]);

  return (
    <TouchableWithoutFeedback onPress={() => setOptionsExpanded((p) => !p)}>
      <View className="flex flex-col w-full">
        <View
          style={[
            styles.wrapper,
            borderTop && styles.borderTop,
            borderBottom && styles.borderBottom,
            { justifyContent: 'space-between', width: '100%' },
          ]}
        >
          <View className="flex flex-row items-center">
            <FontAwesome
              name={icon}
              size={24}
              color={COLORS.neutral.light}
              style={{
                marginHorizontal: 10,
              }}
            />
            {typeof title === 'string' ? (
              <StyledText
                size="xl"
                weight="semibold"
                color={COLORS.neutral.light}
              >
                {title}
              </StyledText>
            ) : (
              title
            )}
          </View>
          {options?.length && (
            <Animated.View style={chevronAnimatedStyle}>
              <FontAwesome
                name="chevron-right"
                size={20}
                color={COLORS.neutral.light}
                style={{
                  marginHorizontal: 10,
                }}
              />
            </Animated.View>
          )}
        </View>
        {/* Options */}

        <Animated.View style={[optionsAnimatedStyles, styles.borderBottom]}>
          {options?.map((option) => (
            <TouchableOpacity
              key={option.title}
              onPress={option.onPress}
              style={{
                padding: 10,
                paddingLeft: 50,
              }}
            >
              <StyledText
                size="xl"
                weight="semibold"
                color={COLORS.neutral.light}
              >
                {option.title}
              </StyledText>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SidebarNavlink;

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderTop: {
    borderTopWidth: 0.5,
    borderColor: COLORS.neutral.normal,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderColor: COLORS.neutral.normal,
  },
});
