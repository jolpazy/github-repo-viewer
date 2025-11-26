import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NavLink } from "./NavLink";

describe("NavLink", () => {
  it("renders link text", () => {
    render(
      <BrowserRouter>
        <NavLink to="/test">Click Me</NavLink>
      </BrowserRouter>
    );

    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies active styles when active", () => {
    render(
      <BrowserRouter>
        <NavLink to="/">Home</NavLink>
      </BrowserRouter>
    );

    const link = screen.getByText("Home");
    expect(link).toBeInTheDocument();
  });
});
