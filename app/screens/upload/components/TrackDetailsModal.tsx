import ModalWrapper from '@/components/reusables/ModalWrapper';
import StyledButton from '@/components/reusables/StyledButton';
import StyledText from '@/components/reusables/StyledText';
import StyledTextField from '@/components/reusables/StyledTextInput';
import COLORS from '@/constants/Colors';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { ActionsEnum } from '@/utils/enums/Action';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  genre: yup.string().required('Genre is required'),
  tags: yup.array().required('Tags are required'),
  cover: yup.string().required('Cover is required'),
  tracks: yup.array().required('Tracks are required'),
});

interface TrackDetailsModalProps {
  action?: ActionsEnum;
  visible: boolean;
  onClose: () => void;
}

const TrackDetailsModal = ({
  action = ActionsEnum.CREATE,
  visible,
  onClose,
}: TrackDetailsModalProps) => {
  const { currentUser } = useAuthStore((state) => state);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitTrack = () => {};
  return (
    <ModalWrapper
      transparent
      blur
      animationType="fade"
      visible={visible}
      onClose={onClose}
    >
      <ScrollView
        className="flex flex-col items-center"
        contentContainerStyle={styles.contentWrapper}
      >
        <StyledTextField
          label="Title"
          placeholder="Enter track title"
          controllerName="title"
          errorMessage={errors.title?.message}
        />

        <View className="m-4">
          <StyledButton
            className="mt-4"
            onPress={handleSubmitTrack}
            variant="primary"
            fullWidth
          >
            <StyledText
              weight="bold"
              size="lg"
              style={{ color: COLORS.neutral.white }}
            >
              Submit
            </StyledText>
          </StyledButton>
        </View>
      </ScrollView>
    </ModalWrapper>
  );
};

export default TrackDetailsModal;

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
    backgroundColor: COLORS.background.dense,
    borderColor: COLORS.neutral.dark,
    borderWidth: 1,
    alignItems: 'center',
  },
});
