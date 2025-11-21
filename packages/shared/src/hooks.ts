import { useQuery } from "@tanstack/react-query";
import { searchRepositories, getRepository } from "./api";
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

export const useRepository = (owner: string, repo: string) => {
  return useQuery({
    queryKey: ["repository", owner, repo],
    queryFn: () => getRepository(owner, repo),
    staleTime: 5 * 60 * 1000,
    enabled: !!owner && !!repo,
  });
};
