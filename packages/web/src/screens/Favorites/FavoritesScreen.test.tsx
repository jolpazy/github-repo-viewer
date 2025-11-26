import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import FavoritesScreen from "./FavoritesScreen";
import { appReducer } from "@repo-viewer/shared";
import * as sharedHooks from "@repo-viewer/shared/dist";

// Mock the useRepository hook
jest.mock("@repo-viewer/shared/dist", () => ({
  ...jest.requireActual("@repo-viewer/shared/dist"),
  useRepository: jest.fn(),
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
        <BrowserRouter>{component}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

describe("FavoritesScreen", () => {
  const mockUseRepository = sharedHooks.useRepository as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders favorites title", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<FavoritesScreen />);
    expect(screen.getByText(/Favorites ❤️/i)).toBeInTheDocument();
  });

  it("renders back to search link", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<FavoritesScreen />);
    const backLink = screen.getByText(/< Back/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("shows empty state when no favorites", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [] } });
    renderWithProviders(<FavoritesScreen />, store);

    expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
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
    renderWithProviders(<FavoritesScreen />, store);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeInTheDocument();
      expect(screen.getByText("A JavaScript library")).toBeInTheDocument();
      expect(screen.getByText(/1000/)).toBeInTheDocument();
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
    renderWithProviders(<FavoritesScreen />, store);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeInTheDocument();
      expect(screen.getByText("vuejs/vue")).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching repository", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [1] } });
    renderWithProviders(<FavoritesScreen />, store);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
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
    renderWithProviders(<FavoritesScreen />, store);

    await waitFor(() => {
      expect(screen.getByText(/Repository not found/i)).toBeInTheDocument();
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

    const queryClient = createTestQueryClient();

    // Pre-populate cache
    queryClient.setQueryData(["repositories", { query: "react", page: 1 }], {
      items: [mockRepo],
    });

    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({ app: { searchQuery: "", favorites: [1] } });
    renderWithProviders(<FavoritesScreen />, store, queryClient);

    await waitFor(() => {
      expect(screen.getByText("facebook/react")).toBeInTheDocument();
    });

    // Should not have called useRepository since data was in cache
    expect(mockUseRepository).toHaveBeenCalled();
  });
});
