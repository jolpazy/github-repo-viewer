import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSearchRepositories } from "@repo-viewer/shared/dist";
import RepoCard from "./components/RepoCard";

import {
  title,
  colors,
  fontSizes,
  space,
  radii,
  DEBOUNCE_MS,
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

const SearchScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.app.searchQuery);

  const favorites = useSelector((state: RootState) => state.app.favorites);

  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(inputValue.trim()));
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [inputValue, dispatch]);

  const { data, isLoading, error } = useSearchRepositories({
    query: searchQuery,
  });

  const results = data?.items ?? [];

  return (
    <Wrapper>
      <Title>React</Title>
      <Subtitle>
        {title}
        {favorites.length > 0 && (
          <>
            or go to: <NavLink to="/favorites">Favorites</NavLink>
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

      {results.length > 0 &&
        results.map(({ id, full_name, stargazers_count, html_url }) => (
          <RepoCard
            id={id}
            key={id}
            name={full_name}
            stars={stargazers_count}
            url={html_url}
          />
        ))}

      {searchQuery && !isLoading && results.length === 0 && (
        <Result>No repositories found.</Result>
      )}
    </Wrapper>
  );
};

export default SearchScreen;
