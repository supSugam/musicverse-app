import React, { useMemo } from 'react';
import {
  View,
  Modal,
  ModalProps,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlexAlignType,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import StyledText from './StyledText';
import ToastInstance from '../ToastInstance';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface IModalWrapperProps extends ModalProps {
  blur?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  closeOnOutsideClick?: boolean;
  position?: 'start' | 'center' | 'end';
  fullWidth?: boolean;
  doNotUseWrapper?: boolean;
}

const ModalWrapper = ({
  visible = false,
  animationType = 'fade',
  transparent = true,
  blur = false,
  header,
  onClose,
  children,
  closeOnOutsideClick,
  position = 'center',
  fullWidth = false,
  doNotUseWrapper = false,
}: IModalWrapperProps) => {
  const alignItems: FlexAlignType =
    position === 'center' ? position : `flex-${position}`;

  const justifyContent: FlexAlignType =
    position === 'center' ? position : `flex-${position}`;

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
          justifyContent: justifyContent,
          alignItems: alignItems,
        },
        modalContainer: {
          width: fullWidth ? '100%' : '90%',
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
    [fullWidth, alignItems, justifyContent]
  );

  const blurIntensity = useMemo(() => (blur ? 90 : 0), [blur]);

  const handleOutsideClick = () => {
    if (!closeOnOutsideClick || !onClose) return;
    onClose();
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
        onPressOut={handleOutsideClick}
      >
        <BlurView
          intensity={blurIntensity}
          style={[StyleSheet.absoluteFill, styles.blurView]}
          tint="dark"
        >
          <Animated.View style={[styles.modalContainer]}>
            <TouchableWithoutFeedback>
              {doNotUseWrapper ? (
                <GestureHandlerRootView className="w-full relative">
                  <View className="absolute top-0 left-0 z-50 w-full">
                    <ToastInstance />
                  </View>
                  {children}
                </GestureHandlerRootView>
              ) : (
                <LinearGradient
                  colors={[
                    COLORS.neutral.black,
                    COLORS.neutral.dark,
                    COLORS.neutral.dense,
                    COLORS.neutral.dense,
                  ]}
                  style={{
                    borderWidth: doNotUseWrapper ? 0 : 1,
                    borderColor: `${COLORS.neutral.light}20`,
                    padding: 16,
                    width: '100%',
                    borderRadius: 10,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View className="absolute top-0 left-0 z-50 w-full">
                    <ToastInstance />
                  </View>
                  {header && (
                    <View style={styles.headerContainer}>
                      {typeof header === 'string' ? (
                        <StyledText
                          size="lg"
                          weight="bold"
                          className="text-left"
                        >
                          {header}
                        </StyledText>
                      ) : (
                        header
                      )}
                    </View>
                  )}

                  {children}
                </LinearGradient>
              )}
            </TouchableWithoutFeedback>
          </Animated.View>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalWrapper;
