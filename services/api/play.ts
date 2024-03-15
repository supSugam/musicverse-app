import { api } from '@/utils/constants';

export const playATrack = async (trackId: string) =>
  api.post(`/tracks/play/${trackId}`);
