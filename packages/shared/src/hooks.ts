import { useQuery } from "@tanstack/react-query";
import { searchRepositories, getRepositoryById } from "./api";
import { SearchParams } from "./types";

export const useSearchRepositories = (params: SearchParams) => {
  return useQuery({
    queryKey: ["repositories", "search", params],
    queryFn: () => searchRepositories(params),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    enabled: params.query.length > 0,
  });
};

export const useRepository = (id: number | undefined) => {
  return useQuery({
    queryKey: ["repository", id],
    queryFn: () => getRepositoryById(id!),
    staleTime: 5 * 60 * 1000,
    enabled: typeof id === "number" && id > 0,
  });
};
