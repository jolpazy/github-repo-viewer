import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@repo-viewer/shared";
import { colors } from "@repo-viewer/shared";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.reactGrey,
              },
              headerTintColor: colors.reactBlue,
              headerTitleStyle: {
                color: colors.white,
                fontWeight: "600",
              },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen
              name="details"
              options={{
                title: "Repository Details",
                headerBackTitle: "Search",
                headerStyle: {
                  backgroundColor: colors.reactLightGrey,
                },
              }}
            />
            <Stack.Screen
              name="favorites"
              options={{
                title: "Favorites",
                headerBackTitle: "Search",
              }}
            />
            <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
