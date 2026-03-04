import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

// =============================================================================
// Header Component Test Scenarios
// =============================================================================

describe("Header Component", () => {
  const defaultProps = {
    connectionStatus: { mode: "demo", connected: false, message: "Demo mode" },
    onHistoryOpen: jest.fn(),
    mode: "demo",
    onModeChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-FE-01
  test("renders application title", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Oracle AI Test Script Generator")).toBeInTheDocument();
  });

  // TC-FE-02
  test("renders subtitle", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText(/Oracle Fusion Cloud/)).toBeInTheDocument();
  });

  // TC-FE-03
  test("shows Demo Mode badge when in demo mode", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Demo Mode")).toBeInTheDocument();
  });

  // TC-FE-04
  test("shows Oracle AI Connected badge when live and connected", () => {
    render(
      <Header
        {...defaultProps}
        connectionStatus={{ mode: "live", connected: true, message: "Connected" }}
      />
    );
    expect(screen.getByText("Oracle AI Connected")).toBeInTheDocument();
  });

  // TC-FE-05
  test("shows Disconnected badge when connection error", () => {
    render(
      <Header
        {...defaultProps}
        connectionStatus={{ mode: "error", connected: false, message: "Error" }}
      />
    );
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  // TC-FE-06
  test("renders History button", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("History")).toBeInTheDocument();
  });

  // TC-FE-07
  test("clicking History button calls onHistoryOpen", () => {
    render(<Header {...defaultProps} />);
    fireEvent.click(screen.getByText("History"));
    expect(defaultProps.onHistoryOpen).toHaveBeenCalledTimes(1);
  });

  // TC-FE-08
  test("renders mode toggle with Demo and Live AI labels", () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByText("Live AI")).toBeInTheDocument();
  });

  // TC-FE-09
  test("clicking toggle switch calls onModeChange to live", () => {
    render(<Header {...defaultProps} mode="demo" />);
    const toggle = screen.getByTitle("Switch to Live AI generation");
    fireEvent.click(toggle);
    expect(defaultProps.onModeChange).toHaveBeenCalledWith("live");
  });

  // TC-FE-10
  test("clicking toggle switch calls onModeChange to demo", () => {
    render(<Header {...defaultProps} mode="live" />);
    const toggle = screen.getByTitle("Switch to Demo mode");
    fireEvent.click(toggle);
    expect(defaultProps.onModeChange).toHaveBeenCalledWith("demo");
  });

  // TC-FE-11
  test("handles null connectionStatus gracefully", () => {
    render(<Header {...defaultProps} connectionStatus={null} />);
    expect(screen.getByText("Demo Mode")).toBeInTheDocument();
  });
});
