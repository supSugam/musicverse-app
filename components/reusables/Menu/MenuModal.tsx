import { Text } from 'react-native';
import ModalWrapper from '../ModalWrapper';
import MenuItem, { IMenuItemProps } from './MenuItem';
import MenuItemsWrapper from './MenuItemsWrapper';

interface IMenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: IMenuItemProps[];
}

const MenuModal = ({ visible, onClose, items }: IMenuModalProps) => {
  return (
    <ModalWrapper
      visible={visible}
      animationType="slide"
      transparent={true}
      transparentWrapper
      onRequestClose={onClose}
      onClose={onClose}
      position="end"
      fullWidth
      closeOnOutsideClick
    >
      <MenuItemsWrapper>
        {items.map((item, index) => (
          <MenuItem key={index} {...item} duration={(index + 1) * 100} />
        ))}
      </MenuItemsWrapper>
    </ModalWrapper>
  );
};

export default MenuModal;
