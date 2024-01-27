import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import { BASE_URL } from '@env';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const MMKVStorage = new MMKV();
