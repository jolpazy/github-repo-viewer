import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  addFavorite,
  removeFavorite,
} from "@repo-viewer/shared";
import { space, colors, labels } from "@repo-viewer/shared";

type RepoCardProps = {
  id: number;
  name: string;
  description?: string;
  stars: number;
  url: string;
};

export default function RepoCard({
  id,
  name,
  description,
  stars,
}: RepoCardProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector((state: RootState) => state.app.favorites);
  const isFavorite = favorites.includes(id);

  const toggleFavorite = () => {
    if (isFavorite) dispatch(removeFavorite(id));
    else dispatch(addFavorite(id));
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
          <Text style={styles.heart}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push(`/details?id=${id}`)}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </TouchableOpacity>

      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      <Text style={styles.stars}>
        ⭐ {stars} {labels.stars}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.reactLightGrey,
    padding: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.xl,
    borderRadius: 8,
    marginBottom: space.md,
    alignItems: "center",
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  heartButton: {
    padding: space.xs,
  },
  heart: {
    fontSize: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.reactBlue,
    marginBottom: space.xs,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.85,
    marginBottom: space.sm,
    textAlign: "center",
  },
  stars: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
  },
});
