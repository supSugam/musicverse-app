import { useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import COLORS from '@/constants/Colors';
import { isValidNumber } from '@/utils/helpers/string';

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
  const [otp, setOtp] = useState<string>(value);

  useEffect(() => {
    setOtp(value);
  }, [value]);

  const inputRefs = Array.from({ length }, () => useRef<TextInput>(null));

  const handleChange = (index: number, value: string) => {
    if (index === length - 1 && otp.length === length) {
      return;
    }
    if (!isValidNumber(value)) {
      inputRefs[index]?.current?.clear();
      return;
    }
    const newOtp = [...otp];

    if (isValidNumber(otp[index])) {
      inputRefs[index + 1]?.current?.focus();
      newOtp[index + 1] = value[value.length - 1];
    } else {
      newOtp[index] = value[0];
    }

    onChange(newOtp.join(''));
    if (value !== '' && index < length - 1) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp.length === 0) {
      inputRefs?.[0]?.current?.focus();
    }

    const newOtp = otp.split('');

    if (index === length - 1) {
      newOtp[index] = '';
    } else {
      newOtp[index] = isValidNumber(newOtp[index + 1]) ? newOtp[index + 1] : '';
    }

    setOtp(newOtp.join(''));

    if (index > 0) {
      inputRefs?.[index - 1]?.current?.focus();
    }

    // Throttle the onChange call to avoid unnecessary re-renders
    onChange(newOtp.join(''));
  };
  return (
    <View className="flex-row justify-between ">
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
            className="w-12 h-14 rounded text-center text-gray-200 text-2xl font-semibold border border-violet-800 "
            maxLength={2}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.nativeEvent.text)}
          />
        ))}
    </View>
  );
};

export default PinCodeInput;
