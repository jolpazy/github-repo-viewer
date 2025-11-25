import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useRepository } from "@repo-viewer/shared/dist";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  addFavorite,
  removeFavorite,
} from "@repo-viewer/shared";
import { colors, space, labels } from "@repo-viewer/shared/dist";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
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

  const openGitHub = () => {
    if (repo?.html_url) {
      Linking.openURL(repo.html_url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.heartButton} onPress={toggleFavorite}>
            <Text style={styles.heartIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.reactBlue} />
            <Text style={styles.statusText}>{labels.loading}</Text>
          </View>
        )}

        {error && (
          <View style={styles.centerContainer}>
            <Text style={styles.statusText}>{labels.error}</Text>
          </View>
        )}

        {!repo && !isLoading && (
          <View style={styles.centerContainer}>
            <Text style={styles.statusText}>{labels.repoNotFound}</Text>
          </View>
        )}

        {repo && (
          <View style={styles.content}>
            <Image
              source={{ uri: repo.owner.avatar_url }}
              style={styles.avatar}
            />

            <Text style={styles.title}>{repo.name}</Text>
            <Text style={styles.owner}>
              {labels.by} {repo.owner.login}
            </Text>

            {repo.description && (
              <Text style={styles.description}>{repo.description}</Text>
            )}

            <Text style={styles.meta}>
              ⭐ {repo.stargazers_count} {labels.stars}
            </Text>

            <TouchableOpacity style={styles.githubButton} onPress={openGitHub}>
              <Text style={styles.githubButtonText}>{labels.viewOnGithub}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactLightGrey,
  },
  scrollContent: {
    flexGrow: 1,
    padding: space.xl,
    backgroundColor: colors.reactLightGrey,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: space.lg,
  },
  heartButton: {
    padding: space.sm,
  },
  heartIcon: {
    fontSize: 32,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.xxl,
  },
  statusText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.75,
    marginTop: space.md,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: space.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.reactBlue,
    marginBottom: space.sm,
    textAlign: "center",
  },
  owner: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginBottom: space.md,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    marginBottom: space.lg,
    textAlign: "center",
    lineHeight: 24,
  },
  meta: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginBottom: space.lg,
  },
  githubButton: {
    backgroundColor: colors.reactBlue,
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    borderRadius: 8,
  },
  githubButtonText: {
    color: colors.reactGrey,
    fontSize: 16,
    fontWeight: "600",
  },
});
