import { useQuery } from "@tanstack/react-query";
import { searchRepositories, getRepositoryById } from "./api";
import { SearchParams } from "./types";
import { REFETCH_MS } from "./constants";

export const useSearchRepositories = (params: SearchParams) => {
  return useQuery({
    queryKey: ["repositories", params],
    queryFn: () => searchRepositories(params),
    staleTime: 60 * 1000,
    refetchInterval: REFETCH_MS,
    enabled: params.query.length > 2,
  });
};

export const useRepository = (id: number | undefined) => {
  return useQuery({
    queryKey: ["repository", id],
    queryFn: () => getRepositoryById(id!),
    staleTime: 60 * 1000,
    refetchInterval: REFETCH_MS,
    enabled: !!id,
  });
};
