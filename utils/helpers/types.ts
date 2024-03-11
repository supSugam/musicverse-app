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
