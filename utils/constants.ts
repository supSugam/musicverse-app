import axios from 'axios';
import { BASE_URL } from '@env';
import { v4 as uuid } from 'uuid';
export const api = axios.create({
  baseURL: BASE_URL,
});

export { uuid };
