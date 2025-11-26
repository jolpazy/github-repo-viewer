import { StyleSheet } from "react-native";
import { colors, space } from "@repo-viewer/shared/dist";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactLightGrey,
  },
  scrollContent: {
    flexGrow: 1,
    padding: space.xl,
    backgroundColor: colors.reactLightGrey,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: space.lg,
  },
  heartButton: {
    padding: space.sm,
  },
  heartIcon: {
    fontSize: 32,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.xxl,
  },
  statusText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.75,
    marginTop: space.md,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: space.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.reactBlue,
    marginBottom: space.sm,
    textAlign: "center",
  },
  owner: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginBottom: space.md,
  },
  description: {
    fontSize: 16,
    color: colors.white,
    marginBottom: space.lg,
    textAlign: "center",
    lineHeight: 24,
  },
  meta: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginBottom: space.lg,
  },
  githubButton: {
    backgroundColor: colors.reactBlue,
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    borderRadius: 8,
  },
  githubButtonText: {
    color: colors.reactGrey,
    fontSize: 16,
    fontWeight: "600",
  },
});
