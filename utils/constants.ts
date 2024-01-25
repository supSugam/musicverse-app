import { BASE_URL } from 'react-native-dotenv';

import axios from 'axios';

export const api = axios.create({
  baseURL: BASE_URL,
});
