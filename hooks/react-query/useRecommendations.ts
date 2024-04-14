import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { PaginationResponse } from '@/utils/Interfaces/IApiResponse';
import { ITrackDetails } from '@/utils/Interfaces/ITrack';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

const useRecommendations = () => {
  const { api, isApiAuthorized } = useAuthStore();

  const getRecommendations = useQuery<
    AxiosResponse<PaginationResponse<ITrackDetails>>,
    Error
  >({
    queryKey: ['recommendations'],
    queryFn: async () => await api.get('/recommendations'),
    enabled: isApiAuthorized(),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return getRecommendations;
};

export default useRecommendations;
