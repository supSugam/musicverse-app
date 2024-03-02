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
      <MenuItemsWrapper header={header} draggable={draggable}>
        {items.map((item, index) => (
          <MenuItem key={index} {...item} duration={(index + 1) * 50} />
        ))}
      </MenuItemsWrapper>
    </ModalWrapper>
  );
};

export default MenuModal;
