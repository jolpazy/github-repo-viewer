import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useRepository } from "@repo-viewer/shared/dist";
import { labels } from "@repo-viewer/shared/dist";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  addFavorite,
  removeFavorite,
} from "@repo-viewer/shared";
import { NavLink } from "../../components/NavLink/NavLink";
import {
  Wrapper,
  HeaderRow,
  HeartButton,
  Avatar,
  View,
  Title,
  Owner,
  Description,
  Meta,
  GithubLink,
  Message,
} from "./DetailsScreen.styled";

const DetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const repoId = Number(id);
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector((state: RootState) => state.app.favorites);
  const isFavorite = favorites.includes(repoId);

  const toggleFavorite = () => {
    if (isFavorite) dispatch(removeFavorite(repoId));
    else dispatch(addFavorite(repoId));
  };

  const queryClient = useQueryClient();

  const cachedSearches = queryClient.getQueriesData<{ items?: any[] }>({
    queryKey: ["repositories", "search"],
  });

  const repoFromCache = cachedSearches
    .flatMap(([, data]) => data?.items ?? [])
    .find((repo) => repo.id === repoId);

  const { data: fetchedRepo, isLoading, error } = useRepository(repoId);

  const repo = repoFromCache ?? fetchedRepo;

  return (
    <Wrapper>
      <HeaderRow>
        <NavLink to="/">{labels.back}</NavLink>

        <HeartButton onClick={toggleFavorite}>
          {isFavorite ? "❤️" : "🤍"}
        </HeartButton>
      </HeaderRow>

      {isLoading && <Message>{labels.loading}</Message>}
      {error && <Message>{labels.error}</Message>}
      {!repo && !isLoading && <Message>{labels.repoNotFound}</Message>}

      {repo && (
        <View>
          <Avatar src={repo.owner.avatar_url} alt={repo.owner.login} />

          <Title>{repo.name}</Title>
          <Owner>
            {labels.by} {repo.owner.login}
          </Owner>

          {repo.description && <Description>{repo.description}</Description>}
          <Meta>
            ⭐ {repo.stargazers_count} {labels.stars}
          </Meta>

          <GithubLink href={repo.html_url} target="_blank" rel="noreferrer">
            {labels.viewOnGithub}
          </GithubLink>
        </View>
      )}
    </Wrapper>
  );
};

export default DetailsScreen;
