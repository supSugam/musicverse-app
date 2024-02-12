import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  ModalProps,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';

interface IModalWrapperProps extends ModalProps {
  blur?: boolean;
  header?: React.ReactElement;
  children: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper = ({
  visible = false,
  animationType = 'fade',
  transparent = true,
  blur = false,
  header,
  onClose,
  children,
}: IModalWrapperProps) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalBackground: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        blurView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalContainer: {
          width: '80%',
          backgroundColor: 'white',
          borderRadius: 10,
        },
        headerContainer: {
          marginBottom: 10,
          borderBottomWidth: 1,
          paddingBottom: 10,
          borderBottomColor: 'rgba(0, 0, 0, 0.1)',
          width: '100%',
        },
      }),
    []
  );

  const blurIntensity = useMemo(() => (blur ? 90 : 0), [blur]);

  const handleOutsideClick = () => {
    onClose(); // Close the modal when clicking outside
  };

  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalBackground}
        onPressOut={handleOutsideClick} // Close modal when clicking outside
      >
        <BlurView
          intensity={blurIntensity}
          style={[StyleSheet.absoluteFill, styles.blurView]}
          tint="dark"
        >
          <Animated.View style={[styles.modalContainer]}>
            <TouchableWithoutFeedback>
              {/* {header && <View style={styles.headerContainer}>{header}</View>} */}
              {children}
            </TouchableWithoutFeedback>
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(ModalWrapper);
