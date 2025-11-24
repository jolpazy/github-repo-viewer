import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { colors, fontSizes, space } from "@repo-viewer/shared/dist";
import { RootState } from "@repo-viewer/shared";
import { useRepository } from "@repo-viewer/shared/dist";
import RepoCard from "./components/RepoCard";

const Wrapper = styled.div`
  background-color: ${colors.reactGrey};
  color: ${colors.white};
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${space.xl}px;
`;

const BackLink = styled(Link)`
  align-self: flex-start;
  margin-bottom: ${space.lg}px;
  color: ${colors.reactBlue};
  text-decoration: none;
  font-size: ${fontSizes.lg}px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const Empty = styled.p`
  font-size: ${fontSizes.md}px;
  opacity: 0.85;
  margin-top: ${space.xl}px;
`;

const FavoriteRepo = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();

  const cachedSearches = queryClient.getQueriesData<{ items?: any[] }>({
    queryKey: ["repositories"],
  });

  const repoFromCache = cachedSearches
    .flatMap(([, data]) => data?.items ?? [])
    .find((repo) => repo.id === id);

  const { data: fetchedRepo, isLoading } = useRepository(id);

  const repo = repoFromCache ?? fetchedRepo;

  if (isLoading) return <Empty>Loading…</Empty>;
  if (!repo) return <Empty>Repository not found.</Empty>;

  return (
    <RepoCard
      id={repo.id}
      name={repo.full_name}
      stars={repo.stargazers_count}
      description={repo.description}
      url={repo.html_url}
    />
  );
};

const FavoritesScreen = () => {
  const favorites = useSelector((state: RootState) => state.app.favorites);

  return (
    <Wrapper>
      <BackLink to="/">{`< Back`}</BackLink>

      {favorites.length === 0 && <Empty>No favorites yet ❤️</Empty>}

      {favorites.map((id) => (
        <FavoriteRepo key={id} id={id} />
      ))}
    </Wrapper>
  );
};

export default FavoritesScreen;
