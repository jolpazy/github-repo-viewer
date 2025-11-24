import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { useSearchRepositories } from "@repo-viewer/shared/dist";
import RepoCard from "./components/RepoCard";

import {
  title,
  colors,
  fontSizes,
  space,
  radii,
  DEBOUNCE_MS,
  ITEMS_PER_PAGE,
} from "@repo-viewer/shared/dist";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, setSearchQuery } from "@repo-viewer/shared";

const Wrapper = styled.div`
  background-color: ${colors.reactGrey};
  color: ${colors.white};
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${space.xl}px;
  font-family: "Inter", system-ui, sans-serif;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${colors.white};
  &:hover {
    background: ${colors.reactLightGrey};
  }
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
  margin-bottom: ${space.xl}px;

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

  const allResults = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Wrapper>
      <Title>React</Title>
      <Subtitle>
        {title}
        {favorites.length > 0 && (
          <>
            {" "}or go to: <NavLink to="/favorites">Favorites</NavLink>
          </>
        )}
      </Subtitle>

      <SearchContainer>
        <SearchIcon>🔍</SearchIcon>
        <Input
          placeholder="Search repositories…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </SearchContainer>

      {isLoading && <Result>Loading…</Result>}
      {error && <Result>Something went wrong.</Result>}

      <ResultsGrid>
        {allResults.length > 0 &&
          allResults.map(
            ({ id, full_name, stargazers_count, html_url, description }) => (
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

      {debouncedInputValue && !isLoading && allResults.length === 0 && (
        <Result>No repositories found.</Result>
      )}

      {allResults.length > 0 && (
        <LoadMoreButton
          disabled={isFetchingNextPage || !hasNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage
            ? "Loading…"
            : hasNextPage
            ? "Load more"
            : "No more results"}
        </LoadMoreButton>
      )}
    </Wrapper>
  );
};

export default SearchScreen;
