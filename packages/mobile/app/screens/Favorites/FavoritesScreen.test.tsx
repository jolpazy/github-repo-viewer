import { render, screen, waitFor } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import FavoritesScreen from "./FavoritesScreen";
import { appReducer } from "@repo-viewer/shared";
import * as sharedHooks from "@repo-viewer/shared/dist";
import { useRouter } from "expo-router";

// Mock the useRepository hook
jest.mock("@repo-viewer/shared/dist", () => ({
  ...jest.requireActual("@repo-viewer/shared/dist"),
  useRepository: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

interface AppState {
  searchQuery: string;
  favorites: number[];
}

const createTestStore = (
  initialState: { app: AppState } = { app: { searchQuery: "", favorites: [] } }
) => {
  return configureStore({
    reducer: {
      app: appReducer,
    },
    preloadedState: initialState,
  });
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (
  component: React.ReactElement,
  store = createTestStore(),
  queryClient = createTestQueryClient()
) => {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </Provider>
  );
};

describe("FavoritesScreen", () => {
  const mockUseRepository = sharedHooks.useRepository as jest.Mock;
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("shows empty state when no favorites", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [] } });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    expect(screen.getByText(/No favorites yet/i)).toBeTruthy();
  });

  it("fetches and displays favorite repositories", async () => {
    const mockRepo = {
      id: 1,
      full_name: "facebook/react",
      description: "A JavaScript library",
      stargazers_count: 1000,
      html_url: "https://github.com/facebook/react",
    };

    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [1] } });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeTruthy();
      expect(screen.getByText("A JavaScript library")).toBeTruthy();
      expect(screen.getByText(/1000/)).toBeTruthy();
    });
  });

  it("displays multiple favorite repositories", async () => {
    mockUseRepository
      .mockReturnValueOnce({
        data: {
          id: 1,
          full_name: "facebook/react",
          description: "A JavaScript library",
          stargazers_count: 1000,
          html_url: "https://github.com/facebook/react",
        },
        isLoading: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: {
          id: 2,
          full_name: "vuejs/vue",
          description: "Progressive framework",
          stargazers_count: 2000,
          html_url: "https://github.com/vuejs/vue",
        },
        isLoading: false,
        error: null,
      });

    const store = createTestStore({
      app: { searchQuery: "", favorites: [1, 2] },
    });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeTruthy();
      expect(screen.getByText("vuejs/vue")).toBeTruthy();
    });
  });

  it("shows loading state while fetching repository", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [1] } });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });

  it("shows not found message for invalid repository", async () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({
      app: { searchQuery: "", favorites: [999] },
    });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    await waitFor(() => {
      expect(screen.getByText(/Repository not found/i)).toBeTruthy();
    });
  });

  it("uses cached data when available", async () => {
    const mockRepo = {
      id: 1,
      full_name: "facebook/react",
      description: "A JavaScript library",
      stargazers_count: 1000,
      html_url: "https://github.com/facebook/react",
    };

    const localQueryClient = createTestQueryClient();

    // Pre-populate cache
    localQueryClient.setQueryData(
      ["repositories", { query: "react", page: 1 }],
      {
        items: [mockRepo],
      }
    );

    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [1] } });
    renderWithProviders(<FavoritesScreen />, store, localQueryClient);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeTruthy();
    });

    // Should have called useRepository but used cache for the data
    expect(mockUseRepository).toHaveBeenCalled();
  });

  it("renders repository with null description", async () => {
    const mockRepo = {
      id: 1,
      full_name: "facebook/react",
      description: null,
      stargazers_count: 1000,
      html_url: "https://github.com/facebook/react",
    };

    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [1] } });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeTruthy();
      expect(screen.getByText(/1000/)).toBeTruthy();
    });
  });

  it("handles mixed states with multiple favorites", async () => {
    mockUseRepository
      .mockReturnValueOnce({
        data: {
          id: 1,
          full_name: "facebook/react",
          description: "A JavaScript library",
          stargazers_count: 1000,
          html_url: "https://github.com/facebook/react",
        },
        isLoading: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: null,
        isLoading: true,
        error: null,
      });

    const store = createTestStore({
      app: { searchQuery: "", favorites: [1, 2] },
    });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeTruthy();
      expect(screen.getByText(/Loading/i)).toBeTruthy();
    });
  });
});
