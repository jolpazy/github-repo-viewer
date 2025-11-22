import axios from "axios";
import { GitHubSearchResponse, GitHubRepository, SearchParams } from "./types";

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
});

export const searchRepositories = async (
  params: SearchParams
): Promise<GitHubSearchResponse> => {
  const { query, page = 1, per_page = 30, filters } = params;

  let searchQuery = query;
  if (filters?.language) {
    searchQuery += ` language:${filters.language}`;
  }

  const response = await api.get<GitHubSearchResponse>("/search/repositories", {
    params: {
      q: searchQuery,
      page,
      per_page,
      sort: filters?.sort,
      order: filters?.order,
    },
  });

  return response.data;
};

export const getRepositoryById = async (
  id: number
): Promise<GitHubRepository> => {
  const response = await api.get<GitHubRepository>(`/repositories/${id}`);
  return response.data;
};
