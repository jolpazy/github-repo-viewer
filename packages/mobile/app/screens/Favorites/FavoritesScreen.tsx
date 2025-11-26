import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { colors, labels } from "@repo-viewer/shared/dist";
import { RootState } from "@repo-viewer/shared";
import { useRepository } from "@repo-viewer/shared/dist";
import RepoCard from "../../components/RepoCard/RepoCard";
import { styles } from "./FavoritesScreen.styles";

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

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="small" color={colors.reactBlue} />
        <Text style={styles.emptyText}>{labels.loading}</Text>
      </View>
    );
  }

  if (!repo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{labels.repoNotFound}</Text>
      </View>
    );
  }

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

export default function FavoritesScreen() {
  const favorites = useSelector((state: RootState) => state.app.favorites);

  return (
    <SafeAreaView style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{labels.noFavorites}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => <FavoriteRepo id={item} />}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}
