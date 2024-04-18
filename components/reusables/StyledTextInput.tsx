import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import React, { RefCallback, useEffect, useRef, useState } from 'react';
import COLORS from '@/constants/Colors';
import StyledText, {
  TextSizeOptions,
  TextWeightOptions,
} from '@/components/reusables/StyledText';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AnimatedTouchable from './AnimatedTouchable';

type TextFieldProps = {
  errorMessage?: any;
  label?: string;
  control?: Control<any>;
  rules?: RegisterOptions;
  controllerName: string;
  variant?: 'default' | 'underlined';
  textSize?: TextSizeOptions;
  fontWeight?: TextWeightOptions;
  backgroundColor?: string;
  textAlign?: 'center' | 'left';
  wrapperClassName?: string;
  borderColor?: string;
  toggleableVisibility?: boolean;
} & React.ComponentProps<typeof TextInput>;
export default function StyledTextField({
  label,
  errorMessage,
  control,
  rules,
  controllerName,
  variant = 'default',
  textSize = 'lg',
  fontWeight = 'normal',
  backgroundColor,
  textAlign = 'left',
  wrapperClassName,
  borderColor = COLORS.purple.dark,
  toggleableVisibility = false,
  ...rest
}: TextFieldProps) {
  const [borderOpacity, setBorderOpacity] = useState<number>(40);
  const isUnderlined = variant === 'underlined';
  const errorMessageHeight = useSharedValue<number>(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [inputWrapperHeight, setInputWrapperHeight] = useState<number>(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: errorMessageHeight.value,
    };
  });
  useEffect(() => {
    errorMessageHeight.value = withTiming(errorMessage ? 35 : 0);
  }, [errorMessage]);

  return (
    <View className={`flex flex-col justify-center w-full ${wrapperClassName}`}>
      {label && (
        <StyledText
          size="base"
          weight="normal"
          className="text-left my-1 text-gray-300"
        >
          {label}
        </StyledText>
      )}

      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          return (
            <TouchableWithoutFeedback
              style={{
                backgroundColor: backgroundColor
                  ? backgroundColor
                  : isUnderlined
                  ? 'transparent'
                  : COLORS.background.dark,
              }}
              className="w-full relative"
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setInputWrapperHeight(height);
              }}
            >
              <TextInput
                onBlur={() => {
                  onBlur();
                  setBorderOpacity(40);
                }}
                secureTextEntry={toggleableVisibility && !isPasswordVisible}
                onChangeText={(text) => onChange(text)}
                value={value}
                placeholderTextColor={'#ffffff80'}
                className={`text-white text-${textSize} font-${fontWeight} text-${textAlign} rounded-md p-3 px-4 w-full placeholder:white placeholder-opacity-50`}
                autoCorrect={false}
                autoComplete="off"
                autoCapitalize="none"
                onSubmitEditing={() => onBlur()}
                blurOnSubmit
                onFocus={() => setBorderOpacity(100)}
                style={{
                  borderColor: errorMessage
                    ? COLORS.red.light
                    : isUnderlined
                    ? `rgba(255, 255, 255, ${borderOpacity / 100})`
                    : borderColor,
                  borderTopWidth: isUnderlined ? 0 : 1,
                  borderBottomWidth: isUnderlined ? 1 : 1,
                  borderLeftWidth: isUnderlined ? 0 : 1,
                  borderRightWidth: isUnderlined ? 0 : 1,
                  // TODO: Border optacity animation on blur and focus
                }}
                ref={ref}
                {...rest}
              />
              {toggleableVisibility && (
                <AnimatedTouchable
                  onPress={(e) => {
                    setIsPasswordVisible((prev) => !prev);
                  }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 16,
                    paddingHorizontal: 16,
                  }}
                  activeOpacity={0.8}
                  onPressAnimation={{
                    duration: 100,
                    scale: 0.5,
                  }}
                  onPressOutAnimation={{
                    duration: 100,
                    scale: 1,
                  }}
                >
                  <FontAwesome
                    name={isPasswordVisible ? 'eye-slash' : 'eye'}
                    size={20}
                    color={COLORS.neutral.light}
                  />
                </AnimatedTouchable>
              )}
            </TouchableWithoutFeedback>
          );
        }}
        name={controllerName}
      />

      <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
        <StyledText size="sm" weight="medium" className="text-red-500 mt-2">
          {errorMessage}
        </StyledText>
      </Animated.View>
    </View>
  );
}
