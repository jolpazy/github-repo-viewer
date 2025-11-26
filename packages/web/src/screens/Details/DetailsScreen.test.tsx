import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import DetailsScreen from "./DetailsScreen";
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
  repoId: string,
  store = createTestStore(),
  queryClient = createTestQueryClient()
) => {
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/repo/:id" element={<DetailsScreen />} />
          </Routes>
        </BrowserRouter>
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

  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, "", "/repo/1");
  });

  it("renders back navigation link", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");
    const backLink = screen.getByText(/< Back/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("shows loading state", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders("1");
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("API Error"),
    });

    renderWithProviders("1");
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("shows not found message when repo is null", () => {
    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");
    expect(screen.getByText(/Repository not found/i)).toBeInTheDocument();
  });

  it("displays repository details", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText(/by facebook/i)).toBeInTheDocument();
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  it("displays owner avatar", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");

    const avatar = screen.getByAltText("facebook");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute(
      "src",
      "https://avatars.githubusercontent.com/u/69631?v=4"
    );
  });

  it("displays GitHub link", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");

    const githubLink = screen.getByText(/View on GitHub/i);
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.closest("a")).toHaveAttribute(
      "href",
      "https://github.com/facebook/react"
    );
    expect(githubLink.closest("a")).toHaveAttribute("target", "_blank");
    expect(githubLink.closest("a")).toHaveAttribute("rel", "noreferrer");
  });

  it("shows empty heart when not favorited", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");
    expect(screen.getByText("🤍")).toBeInTheDocument();
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
    renderWithProviders("1", store);

    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("toggles favorite when heart button is clicked", () => {
    mockUseRepository.mockReturnValue({
      data: mockRepo,
      isLoading: false,
      error: null,
    });

    const store = createTestStore();
    renderWithProviders("1", store);

    const heartButton = screen.getByText("🤍");
    fireEvent.click(heartButton);

    expect(screen.getByText("❤️")).toBeInTheDocument();
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
    renderWithProviders("1", store);

    const heartButton = screen.getByText("❤️");
    fireEvent.click(heartButton);

    expect(screen.getByText("🤍")).toBeInTheDocument();
  });

  it("uses cached data when available", () => {
    const queryClient = createTestQueryClient();

    // Pre-populate cache
    queryClient.setQueryData(["repositories", "search"], {
      items: [mockRepo],
    });

    mockUseRepository.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1", createTestStore(), queryClient);

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText(/by facebook/i)).toBeInTheDocument();
  });

  it("renders without description if not provided", () => {
    const repoWithoutDesc = { ...mockRepo, description: null };

    mockUseRepository.mockReturnValue({
      data: repoWithoutDesc,
      isLoading: false,
      error: null,
    });

    renderWithProviders("1");

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(
      screen.queryByText("A JavaScript library for building user interfaces")
    ).not.toBeInTheDocument();
  });
});
