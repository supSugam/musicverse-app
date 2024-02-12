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
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import StyledText from './StyledText';

interface IModalWrapperProps extends ModalProps {
  blur?: boolean;
  header?: React.ReactNode;
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
          width: '90%',
          borderRadius: 10,
        },
        headerContainer: {
          marginBottom: 16,
          marginTop: 8,
          borderBottomWidth: 1,
          paddingBottom: 10,
          borderBottomColor: COLORS.neutral.gray,
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
              <LinearGradient
                colors={[
                  COLORS.neutral.black,
                  COLORS.neutral.dark,
                  COLORS.neutral.dense,
                  COLORS.neutral.dense,
                ]}
                style={{
                  borderWidth: 1,
                  borderColor: `${COLORS.neutral.light}20`,
                  padding: 16,
                  width: '100%',
                  borderRadius: 10,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {header && (
                  <View style={styles.headerContainer}>
                    {typeof header === 'string' ? (
                      <StyledText size="lg" weight="bold" className="text-left">
                        {header}
                      </StyledText>
                    ) : (
                      header
                    )}
                  </View>
                )}
                {children}
              </LinearGradient>
            </TouchableWithoutFeedback>
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

export default React.memo(ModalWrapper);
