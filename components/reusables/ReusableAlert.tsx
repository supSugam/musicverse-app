import { View, Text } from 'react-native';
import React from 'react';
import ModalWrapper from './ModalWrapper';
import { StyledTouchableOpacity } from './StyledButton';
import StyledText from './StyledText';
import COLORS from '@/constants/Colors';

type ReusableAlertProps = {
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
  header?: React.ReactNode;
  type?: 'alert' | 'success' | 'warning';
};

const ReusableAlert = ({
  visible,
  onClose,
  header,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'alert',
  children,
}: ReusableAlertProps) => {
  return (
    <ModalWrapper
      transparent
      blur
      animationType="fade"
      visible={visible}
      closeOnOutsideClick
      onClose={onClose}
      header={header}
    >
      <View className="flex justify-center items-center w-full">
        {children}
        <View
          style={{
            borderTopColor: COLORS.neutral.gray,
            borderTopWidth: 1,
          }}
          className="flex flex-row justify-end items-center w-full mt-4 pt-4"
        >
          <StyledTouchableOpacity onPress={onClose}>
            <StyledText size="lg" weight="semibold">
              {cancelText}
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            onPress={onConfirm}
            style={{
              backgroundColor:
                type === 'alert'
                  ? COLORS.red.light
                  : type === 'success'
                  ? COLORS.primary.dark
                  : type === 'warning'
                  ? 'yellow'
                  : COLORS.neutral.dark,
            }}
            className="ml-2"
          >
            <StyledText size="lg" weight="bold">
              {confirmText}
            </StyledText>
          </StyledTouchableOpacity>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default ReusableAlert;
