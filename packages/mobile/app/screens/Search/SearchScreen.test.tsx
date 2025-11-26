import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SearchScreen from "./SearchScreen";
import { appReducer } from "@repo-viewer/shared";
import * as sharedHooks from "@repo-viewer/shared/dist";
import { useRouter } from "expo-router";

// Mock the useSearchRepositories hook
jest.mock("@repo-viewer/shared/dist", () => ({
  ...jest.requireActual("@repo-viewer/shared/dist"),
  useSearchRepositories: jest.fn(),
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

const renderWithProviders = (
  component: React.ReactElement,
  store = createTestStore()
) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe("SearchScreen", () => {
  const mockUseSearchRepositories =
    sharedHooks.useSearchRepositories as jest.Mock;
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders search input", () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    renderWithProviders(<SearchScreen />);
    expect(screen.getByPlaceholderText(/Search repositories/i)).toBeTruthy();
  });

  it("renders favorites link", () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    renderWithProviders(<SearchScreen />);
    const favButton = screen.getByText(/Favorites/i);
    expect(favButton).toBeTruthy();
  });

  it("renders search title", () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    renderWithProviders(<SearchScreen />);
    expect(screen.getByText(/Search github repos/i)).toBeTruthy();
  });

  it("shows loading state", () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    renderWithProviders(<SearchScreen />);
    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: new Error("API Error"),
    });

    renderWithProviders(<SearchScreen />);
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
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

    renderWithProviders(<SearchScreen />, store);

    const input = screen.getByPlaceholderText(/Search repositories/i);

    await act(async () => {
      fireEvent.changeText(input, "react");
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText(/No repositories found/i)).toBeTruthy();
    });
  });

  it("displays search results", () => {
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

    renderWithProviders(<SearchScreen />);

    expect(screen.getByText("facebook/react")).toBeTruthy();
    expect(screen.getByText("vuejs/vue")).toBeTruthy();
    expect(screen.getByText("A JavaScript library")).toBeTruthy();
    expect(screen.getByText("Progressive framework")).toBeTruthy();
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

    renderWithProviders(<SearchScreen />);

    const input = screen.getByPlaceholderText(/Search repositories/i);

    await act(async () => {
      fireEvent.changeText(input, "react");
    });

    expect(input.props.value).toBe("react");
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

    renderWithProviders(<SearchScreen />, store);

    const input = screen.getByPlaceholderText(/Search repositories/i);

    await act(async () => {
      fireEvent.changeText(input, "r");
      fireEvent.changeText(input, "re");
      fireEvent.changeText(input, "rea");
      fireEvent.changeText(input, "react");
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(store.getState().app.searchQuery).toBe("react");
    });
  });

  it("shows load more button when has next page", () => {
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

    renderWithProviders(<SearchScreen />);

    expect(screen.getByText(/Load more/i)).toBeTruthy();
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

    renderWithProviders(<SearchScreen />);

    const loadMoreButton = screen.getByText(/Load more/i);

    await act(async () => {
      fireEvent.press(loadMoreButton);
    });

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("disables load more button when fetching next page", () => {
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

    renderWithProviders(<SearchScreen />);

    const loadMoreButton = screen.getByText(/Loading/i);
    expect(loadMoreButton).toBeTruthy();
  });

  it("shows no more results when no next page", () => {
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

    renderWithProviders(<SearchScreen />);

    expect(screen.getByText(/No more results/i)).toBeTruthy();
  });

  it("navigates to favorites when favorites button is clicked", async () => {
    mockUseSearchRepositories.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      error: null,
    });

    renderWithProviders(<SearchScreen />);

    const favButton = screen.getByText(/Favorites/i);

    await act(async () => {
      fireEvent.press(favButton);
    });

    expect(mockPush).toHaveBeenCalledWith("/favorites");
  });
});
