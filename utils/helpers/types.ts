import { DimensionValue } from 'react-native';
import { TAB_ROUTE_NAMES } from '../constants';

export type Dimension = DimensionValue;

export type fontWeights =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;

export type TabRouteName = (typeof TAB_ROUTE_NAMES)[number];

// type C = ColorString<'rgba(0,0,0,0.5)'>; // 'rgba(0,0,0,0.5)
// export type ColorString<C> = C extends string
//   ? C extends `#${infer V}`
//     ? `#${V}`
//     : C extends `rgb(${infer R},${infer G},${infer B})`
//     ? `rgb(${R},${G},${B})`
//     : C extends `rgba(${infer R},${infer G},${infer B},${infer A})`
//     ? `rgba(${R},${G},${B},${A})`
//     : never
//   : never;

export type ColorString = string;
