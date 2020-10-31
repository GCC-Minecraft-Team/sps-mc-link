import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { Route, Link, MemoryRouter } from "react-router-dom";

it("App renders status without crashing.", () => {
  render(<App />);
  expect(screen.getByText("Server Status:")).toBeInTheDocument();
});
