import { StyleSheet } from "react-native";
import { colors, space } from "@repo-viewer/shared/dist";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.reactGrey,
  },
  header: {
    alignItems: "center",
    paddingTop: space.md,
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
  },
  title: {
    fontSize: 32,
    color: colors.white,
    fontWeight: "600",
  },
  listContent: {
    padding: space.lg,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: space.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.85,
    marginTop: space.md,
  },
});
