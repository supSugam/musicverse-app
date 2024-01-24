import { Text as DefaultText } from 'react-native';

import Colors from '@/constants/Colors';

type TextSizeOptions =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

export type TextProps = DefaultText['props'] & {
  className?: string;
  size?: TextSizeOptions;
};

export function Text(props: TextProps) {
  const { style, className = '', size = 'base', ...otherProps } = props;
  const classNames = `text-${size} ${className}`;

  return <DefaultText style={[style]} {...otherProps} className={classNames} />;
}

// export function View(props: ViewProps) {
//   const { style, lightColor, darkColor, ...otherProps } = props;
//   const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

//   return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
// }
