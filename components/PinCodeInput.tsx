import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import COLORS from '@/constants/Colors';
import Toast from 'react-native-toast-message';

interface PinCodeInputProps {
  length?: number;
  onChange: (otp: string) => void;
  value: string;
}

export const PinCodeInput = ({
  length = 6,
  onChange,
  value,
}: PinCodeInputProps) => {
  const otp = value.split('');
  const inputRefs = Array.from({ length }, () => useRef<TextInput>(null));

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    onChange(newOtp.join(''));
    if (value !== '' && index < length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp.length === 0) return;
    if (otp[index] === '') {
      inputRefs[index - 1]?.current?.focus();
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = '';
    onChange(newOtp.join(''));
    inputRefs[index - 1]?.current?.focus();
  };

  const handlePaste = async () => {
    const pastedText = (await Clipboard.getStringAsync()).trim();
    if (
      pastedText.length === length &&
      pastedText.split('').every((char) => !isNaN(parseInt(char)))
    ) {
      onChange(pastedText);
    }
  };

  return (
    <View className="flex-row justify-between">
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            ref={inputRefs[index]}
            keyboardType="number-pad"
            key={index}
            style={{
              backgroundColor: COLORS.background.dense,
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              }
            }}
            className="w-12 h-14 rounded text-center text-gray-200 text-2xl font-semibold border border-violet-800 shadow-violet-600 shadow-xl"
            maxLength={1}
            value={otp[index]}
            onChangeText={(v) => handleChange(index, v)}
            onTextInput={handlePaste}
          />
        ))}
    </View>
  );
};

export default PinCodeInput;
