import React from "react";
import { render, screen, act } from "@testing-library/react";

// Mock the entire services/api module before importing App
// This avoids the axios ESM import issue entirely
jest.mock("./services/api", () => {
  const mockModules = [
    "Financials - General Ledger",
    "HCM - Core HR",
  ];
  const mockTestTypes = [
    "Functional Test",
    "Integration Test",
  ];
  return {
    __esModule: true,
    default: { get: jest.fn(), post: jest.fn() },
    checkHealth: jest.fn().mockResolvedValue({ status: "healthy" }),
    getConnectionStatus: jest.fn().mockResolvedValue({
      mode: "demo",
      connected: false,
      message: "Demo mode",
    }),
    getModules: jest.fn().mockResolvedValue(mockModules),
    getTestTypes: jest.fn().mockResolvedValue(mockTestTypes),
    generateTestScript: jest.fn().mockResolvedValue({
      success: true,
      script: "1. Login\n2. End of Task.",
      model: "demo-mode",
    }),
  };
});

// Import App AFTER the mock is set up
const App = require("./App").default;

// =============================================================================
// App Component Integration Test Scenarios
// =============================================================================

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Re-setup the mocks after clearing
    const api = require("./services/api");
    api.getConnectionStatus.mockResolvedValue({
      mode: "demo",
      connected: false,
      message: "Demo mode",
    });
    api.getModules.mockResolvedValue([
      "Financials - General Ledger",
      "HCM - Core HR",
    ]);
    api.getTestTypes.mockResolvedValue([
      "Functional Test",
      "Integration Test",
    ]);
  });

  // TC-FE-64
  test("renders the application without crashing", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText("Oracle AI Test Script Generator")).toBeInTheDocument();
  });

  // TC-FE-65
  test("loads modules from API on mount", async () => {
    const api = require("./services/api");
    await act(async () => {
      render(<App />);
    });
    expect(api.getModules).toHaveBeenCalled();
  });

  // TC-FE-66
  test("loads test types from API on mount", async () => {
    const api = require("./services/api");
    await act(async () => {
      render(<App />);
    });
    expect(api.getTestTypes).toHaveBeenCalled();
  });

  // TC-FE-67
  test("starts in demo mode by default", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText("Demo Mode")).toBeInTheDocument();
  });

  // TC-FE-68
  test("shows empty output panel initially", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText("No Script Generated Yet")).toBeInTheDocument();
  });

  // TC-FE-69
  test("renders header, input panel, and output panel", async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText("Oracle AI Test Script Generator")).toBeInTheDocument();
    expect(screen.getByText("Configure Test Script")).toBeInTheDocument();
    expect(screen.getByText("Automation Test Script")).toBeInTheDocument();
  });
});
