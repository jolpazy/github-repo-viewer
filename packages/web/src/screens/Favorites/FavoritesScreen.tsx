import styled from "styled-components";

import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { colors, fontSizes, space, labels } from "@repo-viewer/shared/dist";
import { RootState } from "@repo-viewer/shared";
import { useRepository } from "@repo-viewer/shared/dist";
import RepoCard from "../../components/RepoCard";
import { NavLink } from "../../components/NavLink";

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

const Title = styled.h1`
  font-size: ${fontSizes.xl}px;
  margin-bottom: ${space.xl}px;
  margin-top: 0;
`;

const Empty = styled.p`
  font-size: ${fontSizes.md}px;
  opacity: 0.85;
  margin-top: ${space.xl}px;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 350px);
  gap: ${space.xl}px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
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

  if (isLoading) return <Empty>{labels.loading}</Empty>;
  if (!repo) return <Empty>{labels.repoNotFound}</Empty>;

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
      <NavLink to="/">{labels.back}</NavLink>
      <Title>{labels.favorites} ❤️</Title>

      {favorites.length === 0 && <Empty>{labels.noFavorites}</Empty>}

      <FavoritesGrid>
        {favorites.map((id: number) => (
          <FavoriteRepo key={id} id={id} />
        ))}
      </FavoritesGrid>
    </Wrapper>
  );
};

export default FavoritesScreen;
