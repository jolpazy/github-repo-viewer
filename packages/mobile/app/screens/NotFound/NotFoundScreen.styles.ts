import { StyleSheet } from "react-native";
import { colors, space } from "@repo-viewer/shared/dist";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactGrey,
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },
  title: {
    fontSize: 72,
    fontWeight: "700",
    color: colors.reactBlue,
    marginBottom: space.lg,
  },
  message: {
    fontSize: 20,
    color: colors.white,
    opacity: 0.85,
    marginBottom: space.xl,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.reactBlue,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
