import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import StyledText from './StyledText';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimension } from '@/utils/helpers/types';
import AnimatedTouchable from './AnimatedTouchable';

interface IImageDisplayProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  source?: ImageSourcePropType | null | string;
  placeholder?: string | React.ReactNode;
  width?: Dimension;
  height?: Dimension;
  borderRadius?: 'full' | number;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUndoChanges?: () => void;
  bordered?: boolean;
  shadows?: boolean;
}

const ImageDisplay = ({
  source,
  placeholder = '',
  width = 100,
  height = 100,
  borderRadius = 4,
  onPress,
  onEdit,
  onDelete,
  bordered = false,
  shadows = false,
  onUndoChanges,
  ...rest
}: IImageDisplayProps) => {
  const borderRadiusStyle =
    borderRadius === 'full' ? { borderRadius: 999 } : { borderRadius };

  //For the edit icon
  const editScale = useSharedValue(0);
  const editRotation = useSharedValue(0);

  const editAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: editScale.value },
      { rotate: `${editRotation.value}deg` },
    ],
  }));

  //For the delete icon
  const deleteScale = useSharedValue(0);
  const deleteRotation = useSharedValue(0);

  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: deleteScale.value },
      { rotate: `${deleteRotation.value}deg` },
    ],
  }));

  //For the undo changes icon
  const undoChanges = useSharedValue(0);
  const undoChangesRotation = useSharedValue(0);

  const undoChangesAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: undoChanges.value },
      { rotate: `${undoChangesRotation.value}deg` },
    ],
  }));

  useEffect(() => {
    editScale.value = withSpring(source && onEdit ? 1 : 0);
    editRotation.value = withSpring(source && onEdit ? 0 : 180);
    deleteScale.value = withSpring(source && onDelete ? 1 : 0);
    deleteRotation.value = withSpring(source && onDelete ? 0 : 180);
    undoChanges.value = withSpring(source && onUndoChanges ? 1 : 0);
    undoChangesRotation.value = withSpring(source && onUndoChanges ? 0 : 180);
  }, [source, onDelete, onEdit, onUndoChanges]);

  return (
    <AnimatedTouchable onPress={onPress} activeOpacity={0.8} {...rest}>
      <LinearGradient
        colors={[
          COLORS.neutral.black,
          COLORS.neutral.dark,
          COLORS.neutral.dense,
        ]}
        style={[
          styles.container,
          { width, height },
          bordered && styles.bordered,
          shadows && styles.shadows,
          borderRadiusStyle,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {source ? (
          <Image
            source={typeof source === 'string' ? { uri: source } : source}
            style={[styles.image, borderRadiusStyle]}
            resizeMode="cover"
          />
        ) : typeof placeholder === 'string' ? (
          <StyledText size="2xl" weight="bold" className="text-center">
            {placeholder}
          </StyledText>
        ) : (
          placeholder
        )}
        <Animated.View style={[styles.editIcon, editAnimatedStyle]}>
          <TouchableOpacity onPress={onEdit} activeOpacity={0.8}>
            <MaterialIcons name="edit" size={18} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.deleteIcon, deleteAnimatedStyle]}>
          <TouchableOpacity onPress={onDelete} activeOpacity={0.8}>
            <MaterialIcons name="clear" size={18} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.undoIcon, undoChangesAnimatedStyle]}>
          <TouchableOpacity onPress={onUndoChanges} activeOpacity={0.8}>
            <MaterialIcons name="undo" size={18} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bordered: {
    borderColor: COLORS.neutral.normal,
    borderWidth: 1,
  },
  shadows: {
    shadowColor: COLORS.neutral.white,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  // ...
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  editIcon: {
    position: 'absolute',
    top: -18,
    left: -18,
    backgroundColor: `${COLORS.neutral.black}80`,
    padding: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral.normal,
  },
  deleteIcon: {
    position: 'absolute',
    top: -18,
    right: -18,
    backgroundColor: `${COLORS.neutral.black}80`,
    padding: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral.normal,
  },
  undoIcon: {
    position: 'absolute',
    bottom: -18,
    left: -18,
    backgroundColor: `${COLORS.neutral.black}80`,
    padding: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.neutral.normal,
  },
});

export default ImageDisplay;
