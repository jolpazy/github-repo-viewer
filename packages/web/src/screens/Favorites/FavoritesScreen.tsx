import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { labels } from "@repo-viewer/shared/dist";
import { RootState } from "@repo-viewer/shared";
import { useRepository } from "@repo-viewer/shared/dist";
import RepoCard from "../../components/RepoCard/RepoCard";
import { NavLink } from "../../components/NavLink/NavLink";
import { Wrapper, Title, Empty, FavoritesGrid } from "./FavoritesScreen.styled";

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
