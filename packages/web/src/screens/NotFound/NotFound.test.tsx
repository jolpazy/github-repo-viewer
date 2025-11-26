import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFoundScreen from "./NotFoundScreen";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NotFoundScreen", () => {
  it("renders 404 code", () => {
    renderWithRouter(<NotFoundScreen />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders not found title", () => {
    renderWithRouter(<NotFoundScreen />);
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it("renders not found description", () => {
    renderWithRouter(<NotFoundScreen />);
    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it("renders back navigation link", () => {
    renderWithRouter(<NotFoundScreen />);
    const backLink = screen.getByText(/Back/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("back link points to home", () => {
    renderWithRouter(<NotFoundScreen />);
    const backLink = screen.getByText(/Back/i).closest("a");
    expect(backLink).toHaveAttribute("href", "/");
  });
});
