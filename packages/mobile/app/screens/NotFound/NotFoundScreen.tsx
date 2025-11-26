import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { labels } from "@repo-viewer/shared/dist";
import { styles } from "./NotFoundScreen.styles";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>{labels.notFound}</Text>
      <Text style={styles.message}>{labels.notFoundDesc}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/search")}
      >
        <Text style={styles.buttonText}>{labels.backToHome}</Text>
      </TouchableOpacity>
    </View>
  );
}
