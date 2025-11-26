import { render, screen, fireEvent } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import DetailsScreen from "./DetailsScreen";
import { appReducer } from "@repo-viewer/shared";
import * as sharedHooks from "@repo-viewer/shared/dist";
import { useLocalSearchParams } from "expo-router";

// Mock the useRepository hook
jest.mock("@repo-viewer/shared/dist", () => ({
  ...jest.requireActual("@repo-viewer/shared/dist"),
  useRepository: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
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

const mockRepo = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  description: "A JavaScript library for building user interfaces",
  stargazers_count: 1000,
  html_url: "https://github.com/facebook/react",
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
  },
};

describe("DetailsScreen", () => {
  const mockUseRepository = sharedHooks.useRepository as jest.Mock;
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = createTestQueryClient();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("shows loading state", () => {
    mockUseRepository.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });

  it("shows error state", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("API Error"),
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
  });

  it("shows not found message when repo is null", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText(/Repository not found/i)).toBeTruthy();
  });

  it("displays repository details", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);

    expect(screen.getByText("react")).toBeTruthy();
    expect(screen.getByText(/by facebook/i)).toBeTruthy();
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeTruthy();
    expect(screen.getByText(/1000/)).toBeTruthy();
  });

  it("displays repository name", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText("react")).toBeTruthy();
  });

  it("displays repository owner", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText(/by facebook/i)).toBeTruthy();
  });

  it("displays repository description", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeTruthy();
  });

  it("displays stargazers count", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText(/1000/)).toBeTruthy();
  });

  it("displays owner avatar with accessibility label", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);

    const avatar = screen.getByLabelText("facebook avatar");
    expect(avatar).toBeTruthy();
    expect(avatar.props.source.uri).toBe(
      "https://avatars.githubusercontent.com/u/69631?v=4"
    );
  });

  it("displays GitHub link button", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);

    const githubButton = screen.getByText(/View on GitHub/i);
    expect(githubButton).toBeTruthy();
  });

  it("shows empty heart when not favorited", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);
    expect(screen.getByText("🤍")).toBeTruthy();
  });

  it("shows filled heart when favorited", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({
      app: { searchQuery: "", favorites: [1] },
    });
    renderWithProviders(<DetailsScreen />, store, queryClient);

    expect(screen.getByText("❤️")).toBeTruthy();
  });

  it("toggles favorite state when heart icon is pressed", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    const store = createTestStore();
    renderWithProviders(<DetailsScreen />, store, queryClient);

    const heartButton = screen.getByText("🤍");
    fireEvent.press(heartButton);

    expect(screen.getByText("❤️")).toBeTruthy();
  });

  it("removes favorite when clicking filled heart", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    const store = createTestStore({
      app: { searchQuery: "", favorites: [1] },
    });
    renderWithProviders(<DetailsScreen />, store, queryClient);

    const heartButton = screen.getByText("❤️");
    fireEvent.press(heartButton);

    expect(screen.getByText("🤍")).toBeTruthy();
  });

  it("uses cached data when available", () => {
    const localQueryClient = createTestQueryClient();

    // Pre-populate cache
    localQueryClient.setQueryData(["repositories", "search"], {
      items: [mockRepo],
    });

    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), localQueryClient);

    expect(screen.getByText("react")).toBeTruthy();
    expect(screen.getByText(/by facebook/i)).toBeTruthy();
  });

  it("renders without description if not provided", () => {
    const repoWithoutDesc = { ...mockRepo, description: null };

    mockUseRepository.mockReturnValue({
      data: repoWithoutDesc,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<DetailsScreen />, createTestStore(), queryClient);

    expect(screen.getByText("react")).toBeTruthy();
    expect(
      screen.queryByText("A JavaScript library for building user interfaces")
    ).toBeNull();
  });
});
