import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { TAGS_QUERY_KEY } from '@/services/key-factory';
import { useAuthStore } from '@/services/zustand/stores/useAuthStore';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { ITag } from '@/utils/Interfaces/ITag';

interface ITagQuery {
  tags: ITag[];
  totalCount: number;
  isLoading: boolean;
}

export const useTagsQuery = (): ITagQuery => {
  const { api } = useAuthStore((state) => state);
  const [tags, setTags] = useState<ITag[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { data, isLoading, isRefetching, isFetching } = useQuery({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: async () => await api.get('/tags'),
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (data?.data) {
      const { items, totalCount } = data.data.result;
      setTags(items);
      setTotalCount(totalCount);
    }
  }, [data]);

  return {
    tags,
    totalCount,
    isLoading: isLoading || isRefetching || isFetching,
  };
};
