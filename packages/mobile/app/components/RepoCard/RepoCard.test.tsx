import { render, screen, fireEvent } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RepoCard from "./RepoCard";
import { appReducer } from "@repo-viewer/shared";
import { useRouter } from "expo-router";

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

describe("RepoCard", () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  const mockRepo = {
    id: 1,
    name: "facebook/react",
    description: "A JavaScript library for building user interfaces",
    stars: 1000,
    url: "https://github.com/facebook/react",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders repository name", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(screen.getByText("facebook/react")).toBeTruthy();
  });

  it("renders repository description", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeTruthy();
  });

  it("renders star count", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(screen.getByText(/1000/)).toBeTruthy();
  });

  it("renders without description", () => {
    const { description, ...repoWithoutDesc } = mockRepo;
    renderWithProviders(<RepoCard {...repoWithoutDesc} />);
    expect(screen.getByText("facebook/react")).toBeTruthy();
    expect(
      screen.queryByText("A JavaScript library for building user interfaces")
    ).toBeNull();
  });

  it("shows empty heart when not favorited", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(screen.getByText("🤍")).toBeTruthy();
  });

  it("shows filled heart when favorited", () => {
    const store = createTestStore({
      app: { searchQuery: "", favorites: [1] },
    });
    renderWithProviders(<RepoCard {...mockRepo} />, store);
    expect(screen.getByText("❤️")).toBeTruthy();
  });

  it("toggles favorite when heart is clicked", () => {
    const store = createTestStore();
    renderWithProviders(<RepoCard {...mockRepo} />, store);

    const heart = screen.getByText("🤍");
    fireEvent.press(heart);

    expect(screen.getByText("❤️")).toBeTruthy();
  });

  it("removes favorite when clicking filled heart", () => {
    const store = createTestStore({
      app: { searchQuery: "", favorites: [1] },
    });
    renderWithProviders(<RepoCard {...mockRepo} />, store);

    const heart = screen.getByText("❤️");
    fireEvent.press(heart);

    expect(screen.getByText("🤍")).toBeTruthy();
  });

  it("navigates to repo detail when name is clicked", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);

    const name = screen.getByText("facebook/react");
    fireEvent.press(name);

    expect(mockPush).toHaveBeenCalledWith("/1");
  });
});
