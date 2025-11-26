import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";

import { debounce } from "lodash";
import { useSearchRepositories } from "@repo-viewer/shared/dist";
import RepoCard from "../../components/RepoCard/RepoCard";
import { NavLink } from "../../components/NavLink/NavLink";
import { GitHubRepository } from "@repo-viewer/shared/dist/";

import {
  colors,
  fontSizes,
  space,
  radii,
  DEBOUNCE_MS,
  ITEMS_PER_PAGE,
  labels,
} from "@repo-viewer/shared/dist";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, setSearchQuery } from "@repo-viewer/shared";

const Wrapper = styled.div`
  background-color: ${colors.reactGrey};
  color: ${colors.white};
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${space.xl}px;
  font-family: "Inter", system-ui, sans-serif;
  overflow: hidden;
`;

const FavoritesLink = styled(NavLink)`
  font-size: ${fontSizes.lg}px;
`;

const Title = styled.h1`
  font-size: ${fontSizes.xl}px;
  margin-bottom: ${space.sm}px;
  margin-top: 0;
`;

const Subtitle = styled.p`
  font-size: ${fontSizes.lg}px;
  opacity: 0.85;
  margin-bottom: ${space.xl}px;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: ${colors.reactLightGrey};
  border-radius: ${radii.pill}px;
  display: flex;
  align-items: center;
  padding: ${space.sm}px ${space.lg}px;
  gap: ${space.md}px;
  margin: ${space.xl}px auto;

  &:focus-within {
    opacity: 1;
    box-shadow: 0 0 0 2px ${colors.reactBlue};
  }
`;

const SearchIcon = styled.span`
  font-size: ${fontSizes.lg}px;
  opacity: 0.6;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${colors.white};
  font-size: ${fontSizes.md}px;
`;

const Result = styled.p`
  font-size: ${fontSizes.md}px;
  margin: ${space.xs}px 0;
  text-align: center;
`;

const LoadMoreButton = styled.button`
  margin-top: ${space.lg}px;
  padding: ${space.sm}px ${space.lg}px;
  font-size: ${fontSizes.md}px;
  border-radius: ${radii.md}px;
  background: ${colors.reactBlue};
  color: ${colors.white};
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: ${colors.reactLightGrey};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 350px);
  gap: ${space.xl}px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${colors.reactGrey};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${space.xs}px;
  padding-bottom: ${space.xs}px;
`;

const ResultsWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  margin-top: ${space.lg}px;
  background: transparent;

  display: flex;
  justify-content: center;
  padding: 0 ${space.md}px;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors.reactGrey};
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.reactLightGrey};
    opacity: 0.12;
    border-radius: 8px;
    border: 3px solid transparent;
    background-clip: padding-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    opacity: 0.22;
  }

  scrollbar-width: thin;
  scrollbar-color: ${colors.reactLightGrey} ${colors.reactGrey};
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SearchScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.app.searchQuery);
  const favorites = useSelector((state: RootState) => state.app.favorites);

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
      <Header>
        <Subtitle>
          {labels.searchTitle}
          {favorites.length > 0 && (
            <>
              {" "}
              {labels.orGoTo}{" "}
              <FavoritesLink to="/favorites">{labels.favorites}</FavoritesLink>
            </>
          )}
        </Subtitle>
      </Header>

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
        {error && <Result>{labels.error}</Result>}{" "}
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
