import { useState, useEffect, useMemo, useCallback } from "react";
import {
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
  DEBOUNCE_MS,
  ITEMS_PER_PAGE,
  labels,
} from "@repo-viewer/shared/dist";
import RepoCard from "../../components/RepoCard/RepoCard";
import { styles } from "./SearchScreen.styles";

export default function SearchScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchQuery = useSelector((state: RootState) => state.app.searchQuery);

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

  const renderItem = useCallback(
    ({ item }: any) => (
      <RepoCard
        id={item.id}
        name={item.full_name}
        description={item.description}
        stars={item.stargazers_count}
        url={item.html_url}
      />
    ),
    []
  );

  const renderFooter = useCallback(() => {
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
  }, [allResults.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderEmpty = useCallback(() => {
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
  }, [isLoading, error, debouncedInputValue, allResults.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => router.push("/favorites")}
        >
          <Text style={styles.favoritesLink}>{labels.favorites}</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>{labels.searchTitle}</Text>
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 150,
          offset: 150 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}
