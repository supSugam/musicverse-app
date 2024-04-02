import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Href, HrefObject, LinkProps } from 'expo-router';
import COLORS from '@/constants/Colors';
import StyledText from '../reusables/StyledText';
import { FontAwesome } from '@expo/vector-icons';

export type LinkPropsWithoutHref = Omit<LinkProps<string>, 'href'>;
export type HrefString = Href<string>;
export type HrefType = HrefObject<Record<'pathname', HrefString>>;

type ISidebarNavLinkProps = {
  title: string | React.ReactNode;
  icon: keyof (typeof FontAwesome)['glyphMap'];
  borderTop?: boolean;
  borderBottom?: boolean;
};
const SidebarNavlink = ({
  title,
  icon,
  borderTop,
  borderBottom,
}: ISidebarNavLinkProps) => {
  return (
    <View
      style={[
        styles.wrapper,
        borderTop && styles.borderTop,
        borderBottom && styles.borderBottom,
        { justifyContent: 'flex-start', width: '100%' },
      ]}
    >
      <FontAwesome
        name={icon}
        size={24}
        color={COLORS.neutral.light}
        style={{
          marginHorizontal: 10,
        }}
      />
      {typeof title === 'string' ? (
        <StyledText size="xl" weight="semibold" color={COLORS.neutral.light}>
          {title}
        </StyledText>
      ) : (
        title
      )}
    </View>
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
