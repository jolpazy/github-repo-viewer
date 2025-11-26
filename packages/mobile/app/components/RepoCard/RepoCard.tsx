import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  addFavorite,
  removeFavorite,
} from "@repo-viewer/shared";
import { labels } from "@repo-viewer/shared";
import { styles } from "./RepoCard.styles";

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

      <TouchableOpacity onPress={() => router.push(`/${id}`)}>
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
