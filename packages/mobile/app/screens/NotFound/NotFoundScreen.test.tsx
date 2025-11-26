import { render, screen, fireEvent } from "@testing-library/react-native";
import NotFoundScreen from "./NotFoundScreen";
import { useRouter } from "expo-router";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("NotFoundScreen", () => {
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders 404 code", () => {
    render(<NotFoundScreen />);
    expect(screen.getByText("404")).toBeTruthy();
  });

  it("renders not found title", () => {
    render(<NotFoundScreen />);
    expect(screen.getByText(/Page Not Found/i)).toBeTruthy();
  });

  it("renders not found description", () => {
    render(<NotFoundScreen />);
    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeTruthy();
  });

  it("renders back navigation button", () => {
    render(<NotFoundScreen />);
    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeTruthy();
  });

  it("navigates to search when back button is clicked", () => {
    render(<NotFoundScreen />);
    const backButton = screen.getByText(/Back/i);

    fireEvent.press(backButton);

    expect(mockPush).toHaveBeenCalledWith("/search");
  });
});
