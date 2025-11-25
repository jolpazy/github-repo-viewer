import { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { useSearchRepositories } from "@repo-viewer/shared/dist";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, setSearchQuery } from "@repo-viewer/shared";
import {
  colors,
  space,
  DEBOUNCE_MS,
  ITEMS_PER_PAGE,
  labels,
} from "@repo-viewer/shared/dist";
import RepoCard from "../components/RepoCard";

export default function SearchScreen() {
  const router = useRouter();
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

  const allResults = data?.pages.flatMap((page: any) => page.items) ?? [];

  const renderItem = ({ item }: any) => (
    <RepoCard
      id={item.id}
      name={item.full_name}
      description={item.description}
      stars={item.stargazers_count}
      url={item.html_url}
    />
  );

  const renderFooter = () => {
    if (!allResults.length) return null;

    return (
      <TouchableOpacity
        style={[
          styles.loadMoreButton,
          (!hasNextPage || isFetchingNextPage) && styles.buttonDisabled,
        ]}
        disabled={isFetchingNextPage || !hasNextPage}
        onPress={() => fetchNextPage()}
      >
        <Text style={styles.loadMoreText}>
          {isFetchingNextPage
            ? labels.loading
            : hasNextPage
            ? labels.loadMore
            : labels.noMoreResults}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.reactBlue} />
          <Text style={styles.emptyText}>{labels.loading}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{labels.error}</Text>
        </View>
      );
    }

    if (debouncedInputValue && !allResults.length) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{labels.noResults}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{labels.searchTitle}</Text>
          {favorites.length > 0 && (
            <>
              <Text style={styles.subtitle}> {labels.orGoTo} </Text>
              <TouchableOpacity onPress={() => router.push("/favorites")}>
                <Text style={styles.favoritesLink}>{labels.favorites}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={labels.searchPlaceholder}
          placeholderTextColor={colors.white + "80"}
          value={inputValue}
          onChangeText={setInputValue}
        />
      </View>

      <FlatList
        data={allResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        numColumns={1}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactGrey,
  },
  header: {
    alignItems: "center",
    paddingTop: space.md,
    paddingHorizontal: space.lg,
  },
  title: {
    fontSize: 48,
    color: colors.white,
    fontWeight: "bold",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 20,
    color: colors.white,
    opacity: 0.85,
  },
  favoritesLink: {
    fontSize: 20,
    color: colors.reactBlue,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.reactLightGrey,
    borderRadius: 999,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    marginHorizontal: space.lg,
    marginVertical: space.lg,
    gap: space.sm,
  },
  searchIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    padding: space.sm,
  },
  listContent: {
    padding: space.lg,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.75,
    marginTop: space.md,
  },
  loadMoreButton: {
    backgroundColor: colors.reactBlue,
    padding: space.md,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: space.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    color: colors.reactGrey,
    fontSize: 16,
    fontWeight: "600",
  },
});
