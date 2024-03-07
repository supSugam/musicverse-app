import Toast, { ToastType } from 'react-native-toast-message';

type ToastPosition = 'bottom' | 'top';
type ToastContentProps<T extends ToastType> = T extends 'error'
  ? { type: T; content: any; position?: ToastPosition }
  : { type: T; content: string; position?: ToastPosition };

export const toastResponseMessage = ({
  content,
  type = 'error',
  position = 'top',
}: ToastContentProps<ToastType>): void => {
  if (type === 'error') {
    const errorMessage =
      typeof content === 'string'
        ? content
        : content.response.data.message instanceof Array
        ? content.response.data.message[0]
        : content.response.data.message ||
          content.response.message ||
          'An error occurred. Please try again later.';

    if (typeof errorMessage === 'string') {
      Toast.show({
        type: 'error',
        swipeable: true,
        text1: errorMessage,
      });
    } else {
      // Handle the case when the error message is an object
      const firstErrorMessage = Array.isArray(errorMessage)
        ? errorMessage[0]
        : 'Error occurred with no specific message.';

      Toast.show({
        type: 'error',
        swipeable: true,
        text1: firstErrorMessage,
      });
    }
  } else {
    Toast.show({
      type,
      swipeable: true,
      text1: content as string, // Assuming content is always a string for non-error types
      position,
    });
  }
};
