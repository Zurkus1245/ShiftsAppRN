import {api} from './client';
import type {Shift} from '../types';

export async function fetchShiftsByLocation(params: {
  latitude: number;
  longitude: number;
}): Promise<Shift[]> {
  const {latitude, longitude} = params;
  const url = `/shift?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`;
  const {data} = await api.get(url);
  // Ожидаем, что API вернёт массив объектов смен
  return data as Shift[];
}

