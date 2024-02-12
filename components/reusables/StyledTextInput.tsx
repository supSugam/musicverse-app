import { View, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import COLORS from '@/constants/Colors';
import StyledText, {
  TextSizeOptions,
  TextWeightOptions,
} from '@/components/reusables/StyledText';
import { Controller, RegisterOptions } from 'react-hook-form';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type TextFieldProps = {
  errorMessage?: any;
  label?: string;
  control?: any;
  rules?: RegisterOptions;
  controllerName: string;
  variant?: 'default' | 'underlined';
  textSize?: TextSizeOptions;
  fontWeight?: TextWeightOptions;
  backgroundColor?: string;
  textAlign?: 'center' | 'left';
  wrapperClassName?: string;
  borderColor?: string;
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
  ...rest
}: TextFieldProps) {
  const [borderOpacity, setBorderOpacity] = useState<number>(40);
  const isUnderlined = variant === 'underlined';
  const errorMessageHeight = useSharedValue<number>(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: errorMessageHeight.value,
    };
  });

  useEffect(() => {
    errorMessageHeight.value = withTiming(errorMessage ? 30 : 0);
  }, [errorMessage]);

  return (
    <View
      className={`flex flex-col justify-center w-full my-1 ${wrapperClassName}`}
    >
      {label && (
        <StyledText
          size="base"
          weight="normal"
          className="text-left my-1 text-gray-300"
        >
          {label}
        </StyledText>
      )}

      <View
        style={{
          backgroundColor: backgroundColor
            ? backgroundColor
            : isUnderlined
            ? 'transparent'
            : COLORS.background.dark,
        }}
        className="w-full"
      >
        <Controller
          control={control}
          rules={{
            ...(rules || {}),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={() => {
                onBlur();
                setBorderOpacity(40);
              }}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={'#ffffff80'}
              className={`text-${textSize} font-${fontWeight} text-${textAlign} text-white rounded-md p-3 px-4 w-full placeholder:white placeholder-opacity-50`}
              autoCorrect={false}
              autoComplete="off"
              autoCapitalize="none"
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
              {...rest}
            />
          )}
          name={controllerName}
        />
      </View>

      <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
        <StyledText size="sm" weight="medium" className="text-red-500 mt-2">
          {errorMessage}
        </StyledText>
      </Animated.View>
    </View>
  );
}
