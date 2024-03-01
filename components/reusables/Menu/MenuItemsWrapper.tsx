import COLORS from '@/constants/Colors';
import { ScrollView, StyleSheet } from 'react-native';

interface IMenuItemsWrapperProps {
  children: React.ReactNode;
}

const MenuItemsWrapper = ({ children }: IMenuItemsWrapperProps) => {
  return <ScrollView style={styles.wrapper}>{children}</ScrollView>;
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: COLORS.neutral.dense,
    paddingHorizontal: 4,
    paddingVertical: 12,
    maxHeight: 500,
  },
});

export default MenuItemsWrapper;
