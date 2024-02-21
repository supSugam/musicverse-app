import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import COLORS from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import StyledText from '@/components/reusables/StyledText';
import ReusableAlert from '@/components/reusables/ReusableAlert';
import ProgressBar from '@/components/reusables/ProgressBar';
import { GLOBAL_STYLES } from '@/utils/constants';
import { UploadStatus } from '@/utils/enums/IUploadStatus';

export interface IAudioDetailsCardProps {
  title: string;
  size: string;
  duration?: string;
  extension: string;
  onRemove?: () => void;
  onEdit?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  uploadProgress?: number;
  uploadStatus?: UploadStatus;
  alwaysShowProgressBar?: boolean;
}
const AudioDetailsCard = ({
  title,
  size,
  duration = '',
  extension,
  onRemove,
  onEdit,
  icon = 'audio-file',
  uploadProgress,
  uploadStatus,
  alwaysShowProgressBar = false,
}: IAudioDetailsCardProps) => {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);

  return (
    <>
      {onRemove && (
        <ReusableAlert
          cancelText="Cancel"
          confirmText="Confirm"
          onConfirm={onRemove}
          visible={alertVisible}
          onClose={() => {
            setAlertVisible(false);
          }}
          type="alert"
          header={
            <StyledText size="base" className="ml-2">
              Remove Track
            </StyledText>
          }
        >
          <StyledText size="lg" weight="semibold" className="text-left">
            Are you sure you want to remove this audio?
          </StyledText>
        </ReusableAlert>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.cardRoot,
          GLOBAL_STYLES.getDisabledStyles(
            uploadStatus === UploadStatus.UPLOADING
          ),
        ]}
        disabled={uploadStatus === UploadStatus.UPLOADING}
      >
        <View
          style={[
            styles.detailsWrapper,
            uploadStatus === UploadStatus.FAILED ||
            uploadStatus === UploadStatus.CANCELLED
              ? styles.error
              : uploadStatus === UploadStatus.SUCCESS
              ? styles.success
              : {},
          ]}
        >
          <MaterialIcons name={icon} size={30} color={COLORS.neutral.normal} />
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
                onPress={() => setAlertVisible(true)}
              />
            )}
          </View>
        </View>
        {(alwaysShowProgressBar ||
          (uploadStatus === UploadStatus.UPLOADING &&
            uploadProgress !== undefined)) && (
          <ProgressBar progress={uploadProgress || 0} />
        )}
      </TouchableOpacity>
    </>
  );
};

export default AudioDetailsCard;

const styles = StyleSheet.create({
  cardRoot: {
    borderWidth: 1,
    borderColor: COLORS.neutral.normal,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  error: {
    borderColor: COLORS.red.light,
  },
  success: {
    borderColor: COLORS.green.light,
  },
  detailsWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
