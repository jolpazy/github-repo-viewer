import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import RepoCard from "./RepoCard";
import { appReducer } from "@repo-viewer/shared";

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
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("RepoCard", () => {
  const mockRepo = {
    id: 1,
    name: "facebook/react",
    description: "A JavaScript library for building user interfaces",
    stars: 1000,
    url: "https://github.com/facebook/react",
  };

  it("renders repository name", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(screen.getByText("facebook/react")).toBeInTheDocument();
  });

  it("renders repository description", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeInTheDocument();
  });

  it("renders star count", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  it("renders without description", () => {
    const { description, ...repoWithoutDesc } = mockRepo;
    renderWithProviders(<RepoCard {...repoWithoutDesc} />);
    expect(screen.getByText("facebook/react")).toBeInTheDocument();
    expect(screen.queryByText("A JavaScript library")).not.toBeInTheDocument();
  });

  it("shows empty heart when not favorited", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);
    expect(screen.getByText("🤍")).toBeInTheDocument();
  });

  it("shows filled heart when favorited", () => {
    const store = createTestStore({
      app: { searchQuery: "", favorites: [1] },
    });
    renderWithProviders(<RepoCard {...mockRepo} />, store);
    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("toggles favorite when heart is clicked", () => {
    const store = createTestStore();
    renderWithProviders(<RepoCard {...mockRepo} />, store);

    const heart = screen.getByText("🤍");
    fireEvent.click(heart);

    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  it("removes favorite when clicking filled heart", () => {
    const store = createTestStore({
      app: { searchQuery: "", favorites: [1] },
    });
    renderWithProviders(<RepoCard {...mockRepo} />, store);

    const heart = screen.getByText("❤️");
    fireEvent.click(heart);

    expect(screen.getByText("🤍")).toBeInTheDocument();
  });

  it("navigates to repo detail when name is clicked", () => {
    renderWithProviders(<RepoCard {...mockRepo} />);

    const name = screen.getByText("facebook/react");
    fireEvent.click(name);

    // Check if navigation happened (URL changed)
    expect(window.location.pathname).toBe("/repo/1");
  });
});
