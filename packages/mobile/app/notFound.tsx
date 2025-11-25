import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors, labels } from "@repo-viewer/shared";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>{labels.notFound}</Text>
      <Text style={styles.description}>{labels.notFoundDesc}</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>{labels.backToHome}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactLightGrey,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    fontSize: 120,
    color: colors.reactBlue,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "600",
    marginTop: 16,
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.75,
    marginTop: 8,
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.reactBlue,
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.reactGrey,
    fontSize: 16,
    fontWeight: "600",
  },
});
