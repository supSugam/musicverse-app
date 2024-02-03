import Toast, { ToastType } from 'react-native-toast-message';

type ToastContentProps<T extends ToastType> = T extends 'error'
  ? { type: T; content: any }
  : { type: T; content: string };

export const toastResponseMessage = ({
  content,
  type = 'error',
}: ToastContentProps<ToastType>): void => {
  if (type === 'error') {
    const errorMessage =
      content.response?.data?.message ||
      content.response?.message ||
      'Something went wrong.';

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
    });
  }
};
