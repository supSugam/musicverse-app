// styledinput.tsx

import { View, Text, TextInput } from 'react-native';
import React from 'react';
import COLORS from '@/constants/Colors';
import StyledText from '@/components/reusables/StyledText';
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';

type TextFieldProps = {
  errorMessage?: any;
  label: string;
  control: any;
  rules?: RegisterOptions;
  controllerName: string;
} & React.ComponentProps<typeof TextInput>;
export default function StyledTextField({
  label,
  errorMessage,
  control,
  rules,
  controllerName,
  ...rest
}: TextFieldProps) {
  return (
    <View className="flex flex-col justify-center w-full my-1">
      <StyledText
        size="base"
        weight="normal"
        className="text-left my-1 text-gray-300"
      >
        {label}
      </StyledText>
      <View
        style={{
          backgroundColor: COLORS.background.dark,
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
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={'#ffffff80'}
              className={`text-lg text-white border rounded-md p-3 px-4 w-full placeholder:white placeholder-opacity-50 ${
                errorMessage ? 'border-red-500' : 'border-violet-600'
              }`}
              {...rest}
            />
          )}
          name={controllerName}
        />
      </View>
      <StyledText size="sm" weight="medium" className="text-red-500">
        {errorMessage}
      </StyledText>
    </View>
  );
}
