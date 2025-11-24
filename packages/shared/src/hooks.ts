import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { searchRepositories, getRepositoryById } from "./api";
import { SearchParams } from "./types";
import { REFETCH_MS, ITEMS_PER_PAGE } from "./constants";

export const useSearchRepositories = (params: Omit<SearchParams, 'page'>) =>
  useInfiniteQuery({
    queryKey: ["repositories", params],
    queryFn: ({ pageParam = 1 }) => 
      searchRepositories({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.items.length === (params.per_page || ITEMS_PER_PAGE);
      return hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 60 * 1000,
    enabled: params.query.length > 2,
  });

export const useRepository = (id: number) =>
  useQuery({
    queryKey: ["repository", id],
    queryFn: () => getRepositoryById(id!),
    staleTime: 60 * 1000,
    refetchInterval: REFETCH_MS,
    enabled: !!id,
  });
