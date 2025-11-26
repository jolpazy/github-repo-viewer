import { StyleSheet } from "react-native";
import { colors, space } from "@repo-viewer/shared/dist";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactGrey,
  },
  header: {
    alignItems: "center",
    paddingTop: space.xl,
    paddingHorizontal: space.lg,
  },
  favoritesButton: {
    position: "absolute",
    left: space.lg,
    top: space.xl,
  },
  favoritesLink: {
    fontSize: 16,
    color: colors.reactBlue,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 20,
    color: colors.white,
    opacity: 0.85,
    marginTop: space.xxl,
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
