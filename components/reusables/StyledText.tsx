import { joinClassNames } from '@/utils/helpers/string';
import { Text as DefaultText } from 'react-native';

type TextSizeOptions =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

type TextWeightOptions =
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold';

type TextTrackingOptions =
  | 'tighter'
  | 'tight'
  | 'normal'
  | 'wide'
  | 'wider'
  | 'widest';

type TextDimnessOptions = 'extra' | 'high' | 'medium' | 'low' | 'none';

type TextProps = {
  className?: string;
  size?: TextSizeOptions;
  weight?: TextWeightOptions;
  tracking?: TextTrackingOptions;
  dimness?: TextDimnessOptions;
  uppercase?: boolean;
  children: React.ReactNode;
};

const StyledText = (props: TextProps) => {
  const {
    className = '',
    size,
    weight,
    tracking,
    dimness,
    uppercase = false,
    ...otherProps
  } = props;

  const fontClassName = (() => {
    switch (size) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'base':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      case '2xl':
        return 'text-2xl';
      case '3xl':
        return 'text-3xl';
      case '4xl':
        return 'text-4xl';
      case '5xl':
        return 'text-5xl';
      default:
        return 'text-base';
    }
  })();

  const fontWeightClassName = (() => {
    switch (weight) {
      case 'extralight':
        return 'font-extralight';
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  })();

  const fontTrackingClassName = (() => {
    switch (tracking) {
      case 'tighter':
        return 'tracking-tighter';
      case 'tight':
        return 'tracking-tight';
      case 'normal':
        return 'tracking-normal';
      case 'wide':
        return 'tracking-wide';
      case 'wider':
        return 'tracking-wider';
      case 'widest':
        return 'tracking-widest';
      default:
        return 'tracking-normal';
    }
  })();

  const fontDimnessClassName = (() => {
    switch (dimness) {
      case 'extra':
        return 'text-opacity-25';
      case 'high':
        return 'text-opacity-50';
      case 'medium':
        return 'text-opacity-75';
      case 'low':
        return 'text-opacity-90';
      case 'none':
        return 'text-opacity-100';
      default:
        return 'text-opacity-100';
    }
  })();

  const classNames = joinClassNames([
    'text-white',
    fontClassName,
    fontWeightClassName,
    fontTrackingClassName,
    fontDimnessClassName,
    uppercase ? 'uppercase' : '',
    className,
  ]);

  return (
    <DefaultText className={classNames} {...otherProps}>
      {props.children}
    </DefaultText>
  );
};

export default StyledText;
