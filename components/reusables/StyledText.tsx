import { joinClassNames } from '@/utils/helpers/string';
import { Text as DefaultText, TextProps } from 'react-native';

export type TextSizeOptions =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type TextWeightOptions =
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

type TextTrackingOptions =
  | 'tighter'
  | 'tight'
  | 'normal'
  | 'wide'
  | 'wider'
  | 'widest';

type TextOpacityOptions = 'none' | 'low' | 'medium' | 'high';

interface ITextProps extends TextProps {
  className?: string;
  size?: TextSizeOptions;
  weight?: TextWeightOptions;
  tracking?: TextTrackingOptions;
  opacity?: TextOpacityOptions;
  uppercase?: boolean;
  children: React.ReactNode;
}

const StyledText = (props: ITextProps) => {
  const {
    className = '',
    size,
    weight,
    tracking,
    opacity,
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
      case 'extrabold':
        return 'font-extrabold';
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

  const fontOpacityStyle = (() => {
    switch (opacity) {
      case 'none':
        return { opacity: 1 };
      case 'low':
        return { opacity: 0.3 };
      case 'medium':
        return { opacity: 0.5 };
      case 'high':
        return { opacity: 0.8 };
      default:
        return { opacity: 1 };
    }
  })();

  const classNames = joinClassNames([
    'text-white',
    fontClassName,
    fontWeightClassName,
    fontTrackingClassName,
    uppercase ? 'uppercase' : '',
    className,
  ]);

  return (
    <DefaultText
      className={classNames}
      style={[fontOpacityStyle, otherProps.style]}
    >
      {props.children}
    </DefaultText>
  );
};

export default StyledText;
