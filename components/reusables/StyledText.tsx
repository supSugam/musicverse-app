import { joinClassNames } from '@/utils/helpers/string';
import { ColorString, fontWeights } from '@/utils/helpers/types';
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
  color?: ColorString;
}

const StyledText = (props: ITextProps) => {
  const {
    className = '',
    size,
    weight,
    tracking,
    opacity,
    uppercase = false,
    style,
    color = 'white',
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

  const fontWeightStyle = (() => {
    switch (weight) {
      case 'extralight':
        return { fontWeight: '200' };
      case 'light':
        return { fontWeight: '300' };
      case 'normal':
        return { fontWeight: '400' };
      case 'medium':
        return { fontWeight: '500' };
      case 'semibold':
        return { fontWeight: '600' };
      case 'bold':
        return { fontWeight: '700' };
      case 'extrabold':
        return { fontWeight: '800' };
      default:
        return { fontWeight: '400' };
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
    fontTrackingClassName,
    uppercase ? 'uppercase' : '',
    className,
  ]);

  return (
    <DefaultText
      className={classNames}
      style={[
        fontOpacityStyle,
        {
          fontWeight: fontWeightStyle.fontWeight as fontWeights,
          color,
        },
        style,
      ]}
      {...otherProps}
    >
      {props.children}
    </DefaultText>
  );
};

export default StyledText;
