import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://mobile.handswork.pro/api',
  timeout: 15000,
});

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

