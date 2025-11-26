import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import SearchScreen from "./SearchScreen";
import { appReducer } from "@repo-viewer/shared";
import * as sharedHooks from "@repo-viewer/shared/dist";

// Mock the useSearchRepositories hook
jest.mock("@repo-viewer/shared/dist", () => ({
  ...jest.requireActual("@repo-viewer/shared/dist"),
  useSearchRepositories: jest.fn(),
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

const renderWithProviders = async (
  component: React.ReactElement,
  store = createTestStore(),
  queryClient = createTestQueryClient()
) => {
  let result: any;
  await act(async () => {
    result = render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>{component}</BrowserRouter>
        </QueryClientProvider>
      </Provider>
    );
  });
  return result;
};

describe("SearchScreen", () => {
  const mockUseSearchRepositories =
    sharedHooks.useSearchRepositories as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders search input", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);
    expect(
      screen.getByPlaceholderText(/Search repositories/i)
    ).toBeInTheDocument();
  });

  it("renders favorites link", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);
    const favLink = screen.getByText(/Favorites/i);
    expect(favLink).toBeInTheDocument();
    expect(favLink.closest("a")).toHaveAttribute("href", "/favorites");
  });

  it("renders search title", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);
    expect(screen.getByText(/Search github repos/i)).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("shows error state", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: new Error("API Error"),
    });

    await renderWithProviders(<SearchScreen />);
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("shows no results message", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: { pages: [{ items: [] }] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    const store = createTestStore({
      app: { searchQuery: "react", favorites: [] },
    });

    await renderWithProviders(<SearchScreen />, store);

    const input = screen.getByPlaceholderText(/Search repositories/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: "react" } });
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText(/No repositories found/i)).toBeInTheDocument();
    });
  });

  it("displays search results", async () => {
    const mockRepos = [
      {
        id: 1,
        full_name: "facebook/react",
        description: "A JavaScript library",
        stargazers_count: 1000,
        html_url: "https://github.com/facebook/react",
      },
      {
        id: 2,
        full_name: "vuejs/vue",
        description: "Progressive framework",
        stargazers_count: 2000,
        html_url: "https://github.com/vuejs/vue",
      },
    ];

    mockUseSearchRepositories.mockReturnValue({
      data: { pages: [{ items: mockRepos }] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);

    expect(screen.getByText("facebook/react")).toBeInTheDocument();
    expect(screen.getByText("vuejs/vue")).toBeInTheDocument();
    expect(screen.getByText("A JavaScript library")).toBeInTheDocument();
    expect(screen.getByText("Progressive framework")).toBeInTheDocument();
  });

  it("updates search input", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);

    const input = screen.getByPlaceholderText(/Search repositories/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: "react" } });
    });

    expect(input).toHaveValue("react");
  });

  it("debounces search input", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    const store = createTestStore();

    await renderWithProviders(<SearchScreen />, store);

    const input = screen.getByPlaceholderText(/Search repositories/i);

    await act(async () => {
      fireEvent.change(input, { target: { value: "r" } });
      fireEvent.change(input, { target: { value: "re" } });
      fireEvent.change(input, { target: { value: "rea" } });
      fireEvent.change(input, { target: { value: "react" } });
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(store.getState().app.searchQuery).toBe("react");
    });
  });

  it("shows load more button when has next page", async () => {
    const mockRepos = [
      {
        id: 1,
        full_name: "facebook/react",
        description: "A JavaScript library",
        stargazers_count: 1000,
        html_url: "https://github.com/facebook/react",
      },
    ];

    mockUseSearchRepositories.mockReturnValue({
      data: { pages: [{ items: mockRepos }] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);

    expect(screen.getByText(/Load more/i)).toBeInTheDocument();
  });

  it("calls fetchNextPage when load more is clicked", async () => {
    const mockFetchNextPage = jest.fn();
    const mockRepos = [
      {
        id: 1,
        full_name: "facebook/react",
        description: "A JavaScript library",
        stargazers_count: 1000,
        html_url: "https://github.com/facebook/react",
      },
    ];

    mockUseSearchRepositories.mockReturnValue({
      data: { pages: [{ items: mockRepos }] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      error: null,
    });

    await renderWithProviders(<SearchScreen />);

    const loadMoreButton = screen.getByText(/Load more/i);

    await act(async () => {
      fireEvent.click(loadMoreButton);
    });

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("disables load more button when fetching next page", async () => {
    const mockRepos = [
      {
        id: 1,
        full_name: "facebook/react",
        description: "A JavaScript library",
        stargazers_count: 1000,
        html_url: "https://github.com/facebook/react",
      },
    ];

    mockUseSearchRepositories.mockReturnValue({
      data: { pages: [{ items: mockRepos }] },
      isLoading: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);

    const loadMoreButton = screen.getByRole("button", { name: /loading/i });
    expect(loadMoreButton).toBeDisabled();
  });

  it("shows no more results when no next page", async () => {
    const mockRepos = [
      {
        id: 1,
        full_name: "facebook/react",
        description: "A JavaScript library",
        stargazers_count: 1000,
        html_url: "https://github.com/facebook/react",
      },
    ];

    mockUseSearchRepositories.mockReturnValue({
      data: { pages: [{ items: mockRepos }] },
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    await renderWithProviders(<SearchScreen />);

    expect(screen.getByText(/No more results/i)).toBeInTheDocument();
  });
});
