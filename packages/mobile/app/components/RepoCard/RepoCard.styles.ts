import { StyleSheet } from "react-native";
import { space, colors } from "@repo-viewer/shared";

export const styles = StyleSheet.create({
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
