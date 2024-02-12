import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';

export interface IAudioDetailsCardProps {
  title: string;
  size: string;
  duration: string;
  extension: string;
  onRemove?: () => void;
  onEdit?: () => void;
}
const AudioDetailsCard = ({
  title,
  size,
  duration,
  extension,
  onRemove,
  onEdit,
}: IAudioDetailsCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.cardRoot}>
      <MaterialIcons
        name="audio-file"
        size={32}
        color={COLORS.neutral.normal}
      />
      <View className="flex flex-col ml-2 items-start justify-center flex-1">
        <StyledText
          weight="semibold"
          size="base"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </StyledText>
        <StyledText
          weight="extralight"
          size="sm"
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-neutral-400"
        >{`${size} | ${duration} | ${extension}`}</StyledText>
      </View>
      <View className="flex flex-row ml-2 items-center">
        {onEdit && (
          <>
            <MaterialIcons
              name="edit"
              size={28}
              color={COLORS.neutral.normal}
              onPress={onEdit}
            />
            <View className="w-2" />
          </>
        )}
        {onRemove && (
          <MaterialIcons
            name="delete"
            size={28}
            color={COLORS.red.light}
            onPress={onRemove}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AudioDetailsCard;

const styles = StyleSheet.create({
  cardRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral.normal,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
});
