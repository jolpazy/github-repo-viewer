export interface GitHubRepository {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export type SearchParams = {
  query: string;
  page?: number;
  per_page?: number;
  filters?: {
    language?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
};
