import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import { useRepository } from "@repo-viewer/shared/dist";

import { colors, fontSizes, space, radii } from "@repo-viewer/shared/dist";

const Wrapper = styled.div`
  background-color: ${colors.reactLightGrey};
  color: ${colors.white};
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: ${space.xl}px;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: ${radii.pill}px;
  object-fit: cover;
  margin-bottom: ${space.md}px;
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

const View = styled.div`
  padding: ${space.xl}px;
  border-radius: ${radii.md}px;
  max-width: 640px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${fontSizes.xl}px;
  margin-bottom: ${space.sm}px;
  color: ${colors.reactBlue};
`;

const Owner = styled.p`
  font-size: ${fontSizes.sm}px;
  opacity: 0.8;
  margin-bottom: ${space.md}px;
`;

const Description = styled.p`
  font-size: ${fontSizes.md}px;
  opacity: 0.9;
  margin-bottom: ${space.md}px;
`;

const Meta = styled.p`
  font-size: ${fontSizes.sm}px;
  opacity: 0.8;
  margin-bottom: ${space.sm}px;
`;

const GithubLink = styled.a`
  color: ${colors.reactBlue};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const repoId = Number(id);
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
      <BackLink to="/">{`< Back`}</BackLink>

      {isLoading && <p>Loading…</p>}
      {error && <p>Something went wrong.</p>}
      {!repo && !isLoading && <p>Repository not found.</p>}

      {repo && (
        <View>
          <Avatar src={repo.owner.avatar_url} alt={repo.owner.login} />

          <Title>{repo.name}</Title>
          <Owner>by {repo.owner.login}</Owner>

          {repo.description && <Description>{repo.description}</Description>}
          <Meta>⭐ {repo.stargazers_count} stars</Meta>

          <GithubLink href={repo.html_url} target="_blank" rel="noreferrer">
            View on GitHub
          </GithubLink>
        </View>
      )}
    </Wrapper>
  );
};

export default DetailsScreen;
