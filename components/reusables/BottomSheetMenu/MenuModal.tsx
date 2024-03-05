import { View } from 'react-native';
import ModalWrapper from '../ModalWrapper';
import MenuItem, { IMenuItemProps } from './MenuItem';
import MenuItemsWrapper from './MenuItemsWrapper';

interface IMenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: IMenuItemProps[];
  header?: string | React.ReactNode;
  draggable?: boolean;
}

const MenuModal = ({
  visible,
  onClose,
  items,
  header,
  draggable = false,
}: IMenuModalProps) => {
  return (
    <ModalWrapper
      visible={visible}
      animationType="slide"
      transparent={true}
      doNotUseWrapper
      onRequestClose={onClose}
      onClose={onClose}
      position="end"
      fullWidth
      closeOnOutsideClick
    >
      <MenuItemsWrapper
        closeMenu={onClose}
        header={header}
        draggable={draggable}
      >
        {items.map((item, index) => {
          return (
            <MenuItem
              key={index}
              {...item}
              duration={(index + 1) * 150}
              borderTop={index === 0}
              borderBottom
            />
          );
        })}
      </MenuItemsWrapper>
    </ModalWrapper>
  );
};

export default MenuModal;
