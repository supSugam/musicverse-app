import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { GENRES_QUERY_KEY, PROFILE_QUERY_KEY } from '@/services/key-factory';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { IGenre } from '@/utils/Interfaces/IGenre';

interface IProfileQuery {
  genres: IGenre[];
  totalCount: number;
  isLoading: boolean;
}

export const useGenreQuery = (): IProfileQuery => {
  const { api } = useAuthStore((state) => state);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { data, isLoading, isRefetching, isFetching } = useQuery({
    queryKey: [GENRES_QUERY_KEY],
    queryFn: async () => await api.get('/genre'),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.data) {
      const { items, totalCount } = data.data.result;
      setGenres(items);
      setTotalCount(totalCount);
    }
  }, [data]);

  return {
    genres,
    totalCount,
    isLoading: isLoading || isRefetching || isFetching,
  };
};
