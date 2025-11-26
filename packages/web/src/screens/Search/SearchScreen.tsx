import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useSearchRepositories } from "@repo-viewer/shared/dist";
import RepoCard from "../../components/RepoCard/RepoCard";
import { GitHubRepository } from "@repo-viewer/shared/dist/";
import { DEBOUNCE_MS, ITEMS_PER_PAGE, labels } from "@repo-viewer/shared/dist";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, setSearchQuery } from "@repo-viewer/shared";
import {
  Wrapper,
  HeaderRow,
  FavoritesLink,
  Subtitle,
  SearchContainer,
  SearchIcon,
  Input,
  Result,
  LoadMoreButton,
  ResultsGrid,
  ResultsWrapper,
  ResultsContainer,
} from "./SearchScreen.styled";

const SearchScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.app.searchQuery);

  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedInputValue, setDebouncedInputValue] = useState(inputValue);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const trimmedValue = value.trim();
        setDebouncedInputValue(trimmedValue);
        dispatch(setSearchQuery(trimmedValue));
      }, DEBOUNCE_MS),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useSearchRepositories({
    query: debouncedInputValue,
    per_page: ITEMS_PER_PAGE,
  });

  const allResults = data?.pages.flatMap((page: any) => page.items) ?? [];

  return (
    <Wrapper>
      <HeaderRow>
        <FavoritesLink to="/favorites">{labels.favorites}</FavoritesLink>
      </HeaderRow>

      <Subtitle>{labels.searchTitle}</Subtitle>

      <SearchContainer>
        <SearchIcon>🔍</SearchIcon>
        <Input
          placeholder={labels.searchPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </SearchContainer>

      <ResultsWrapper>
        {isLoading && <Result>{labels.loading}</Result>}
        {error && <Result>{labels.error}</Result>}
        {debouncedInputValue && !isLoading && allResults.length === 0 && (
          <Result>{labels.noResults}</Result>
        )}
        {allResults.length > 0 && (
          <ResultsContainer>
            <ResultsGrid>
              {allResults.map(
                ({
                  id,
                  full_name,
                  stargazers_count,
                  html_url,
                  description,
                }: GitHubRepository) => (
                  <RepoCard
                    id={id}
                    key={id}
                    name={full_name}
                    stars={stargazers_count}
                    url={html_url}
                    description={description ?? undefined}
                  />
                )
              )}
            </ResultsGrid>
            <LoadMoreButton
              disabled={isFetchingNextPage || !hasNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage
                ? labels.loading
                : hasNextPage
                ? labels.loadMore
                : labels.noMoreResults}
            </LoadMoreButton>
          </ResultsContainer>
        )}
      </ResultsWrapper>
    </Wrapper>
  );
};

export default SearchScreen;
