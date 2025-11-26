import {
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
import { labels } from "@repo-viewer/shared/dist";
import { styles } from "./DetailsScreen.styles";

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
            <ActivityIndicator size="large" color="#61DAFB" />
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
              accessibilityLabel={`${repo.owner.login} avatar`}
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
