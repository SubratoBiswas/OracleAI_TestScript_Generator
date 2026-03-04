/**
 * Test scenarios for the OracleAI TestScript Generator Frontend.
 *
 * Covers:
 *   - App initialization and data fetching
 *   - InputPanel form validation and interactions
 *   - OutputPanel rendering states (empty, loading, error, result)
 *   - Header mode toggle and connection badge
 *   - HistoryDrawer open/close and item selection
 *   - API service layer
 */

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "./App";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import OutputPanel from "./components/OutputPanel";
import HistoryDrawer from "./components/HistoryDrawer";
import * as api from "./services/api";

// Mock the API module
jest.mock("./services/api");

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const MOCK_MODULES = [
  "Financials - General Ledger",
  "Financials - Accounts Payable",
  "HCM - Core HR",
  "Procurement - Purchasing",
];

const MOCK_TEST_TYPES = [
  "Functional Test",
  "Integration Test",
  "Regression Test",
];

const MOCK_CONNECTION_STATUS = {
  connected: false,
  mode: "demo",
  message: "Demo mode active",
};

const MOCK_RESULT = {
  success: true,
  script:
    "# Automation Test Script\n# Module: Financials - General Ledger\n1. Login to: URL: https://env.com, Username: admin, Password: pass\n2. Click in the User ID field and enter \"admin\".\n3. Press the Sign In button.\n4. Verify the Home dashboard page is displayed.\n5. Click the Navigator icon.\n6. End of Task.",
  model: "demo-mode",
  note: "Demo mode active.",
};

// ---------------------------------------------------------------------------
// 1. App Component – Initialization
// ---------------------------------------------------------------------------

describe("App Component", () => {
  beforeEach(() => {
    api.getConnectionStatus.mockResolvedValue(MOCK_CONNECTION_STATUS);
    api.getModules.mockResolvedValue(MOCK_MODULES);
    api.getTestTypes.mockResolvedValue(MOCK_TEST_TYPES);
    api.generateTestScript.mockResolvedValue(MOCK_RESULT);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the application header", async () => {
    await act(async () => render(<App />));
    expect(screen.getByText("Oracle AI Test Script Generator")).toBeInTheDocument();
  });

  test("fetches modules and test types on mount", async () => {
    await act(async () => render(<App />));
    expect(api.getModules).toHaveBeenCalledTimes(1);
    expect(api.getTestTypes).toHaveBeenCalledTimes(1);
    expect(api.getConnectionStatus).toHaveBeenCalledTimes(1);
  });

  test("shows empty output panel initially", async () => {
    await act(async () => render(<App />));
    expect(screen.getByText("No Script Generated Yet")).toBeInTheDocument();
  });

  test("falls back to hardcoded modules on API failure", async () => {
    api.getConnectionStatus.mockRejectedValue(new Error("Network Error"));
    api.getModules.mockRejectedValue(new Error("Network Error"));
    api.getTestTypes.mockRejectedValue(new Error("Network Error"));
    await act(async () => render(<App />));
    // App should still render with fallback modules
    expect(screen.getByText("Oracle AI Test Script Generator")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Header Component
// ---------------------------------------------------------------------------

describe("Header Component", () => {
  test("renders the app title", () => {
    render(
      <Header
        connectionStatus={MOCK_CONNECTION_STATUS}
        onHistoryOpen={jest.fn()}
        mode="demo"
        onModeChange={jest.fn()}
      />
    );
    expect(screen.getByText("Oracle AI Test Script Generator")).toBeInTheDocument();
  });

  test("shows Demo Mode badge when in demo mode", () => {
    render(
      <Header
        connectionStatus={MOCK_CONNECTION_STATUS}
        onHistoryOpen={jest.fn()}
        mode="demo"
        onModeChange={jest.fn()}
      />
    );
    expect(screen.getByText("Demo Mode")).toBeInTheDocument();
  });

  test("shows Oracle AI Connected badge when live and connected", () => {
    render(
      <Header
        connectionStatus={{ connected: true, mode: "live", message: "Connected" }}
        onHistoryOpen={jest.fn()}
        mode="live"
        onModeChange={jest.fn()}
      />
    );
    expect(screen.getByText("Oracle AI Connected")).toBeInTheDocument();
  });

  test("shows Disconnected badge on error mode", () => {
    render(
      <Header
        connectionStatus={{ connected: false, mode: "error", message: "Failed" }}
        onHistoryOpen={jest.fn()}
        mode="live"
        onModeChange={jest.fn()}
      />
    );
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  test("calls onHistoryOpen when History button is clicked", () => {
    const onHistoryOpen = jest.fn();
    render(
      <Header
        connectionStatus={MOCK_CONNECTION_STATUS}
        onHistoryOpen={onHistoryOpen}
        mode="demo"
        onModeChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("History"));
    expect(onHistoryOpen).toHaveBeenCalledTimes(1);
  });

  test("toggles mode when toggle switch is clicked", () => {
    const onModeChange = jest.fn();
    render(
      <Header
        connectionStatus={MOCK_CONNECTION_STATUS}
        onHistoryOpen={jest.fn()}
        mode="demo"
        onModeChange={onModeChange}
      />
    );
    fireEvent.click(screen.getByTitle("Switch to Live AI generation"));
    expect(onModeChange).toHaveBeenCalledWith("live");
  });

  test("toggles from live to demo", () => {
    const onModeChange = jest.fn();
    render(
      <Header
        connectionStatus={MOCK_CONNECTION_STATUS}
        onHistoryOpen={jest.fn()}
        mode="live"
        onModeChange={onModeChange}
      />
    );
    fireEvent.click(screen.getByTitle("Switch to Demo mode"));
    expect(onModeChange).toHaveBeenCalledWith("demo");
  });
});

// ---------------------------------------------------------------------------
// 3. InputPanel Component
// ---------------------------------------------------------------------------

describe("InputPanel Component", () => {
  const defaultProps = {
    modules: MOCK_MODULES,
    testTypes: MOCK_TEST_TYPES,
    formData: {
      module: "",
      testType: "",
      description: "",
      additionalContext: "",
      envUrl: "",
      username: "",
      password: "",
    },
    onFormChange: jest.fn(),
    onGenerate: jest.fn(),
    isLoading: false,
    mode: "demo",
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders module dropdown with options", () => {
    render(<InputPanel {...defaultProps} />);
    expect(screen.getByText("Select module...")).toBeInTheDocument();
    MOCK_MODULES.forEach((mod) => {
      expect(screen.getByText(mod)).toBeInTheDocument();
    });
  });

  test("renders test type dropdown with options", () => {
    render(<InputPanel {...defaultProps} />);
    expect(screen.getByText("Select type...")).toBeInTheDocument();
    MOCK_TEST_TYPES.forEach((t) => {
      expect(screen.getByText(t)).toBeInTheDocument();
    });
  });

  test("generate button is disabled when form is incomplete", () => {
    render(<InputPanel {...defaultProps} />);
    const btn = screen.getByText("Generate Demo Script");
    expect(btn.closest("button")).toBeDisabled();
  });

  test("generate button is enabled when required fields are filled (demo mode)", () => {
    const filledForm = {
      ...defaultProps.formData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire a new employee",
    };
    render(<InputPanel {...defaultProps} formData={filledForm} />);
    const btn = screen.getByText("Generate Demo Script");
    expect(btn.closest("button")).not.toBeDisabled();
  });

  test("generate button disabled in live mode without credentials", () => {
    const filledForm = {
      ...defaultProps.formData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire a new employee",
    };
    render(<InputPanel {...defaultProps} formData={filledForm} mode="live" />);
    const btn = screen.getByText("Generate with AI");
    expect(btn.closest("button")).toBeDisabled();
  });

  test("generate button enabled in live mode with all credentials", () => {
    const filledForm = {
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire a new employee",
      additionalContext: "",
      envUrl: "https://env.com",
      username: "admin",
      password: "pass",
    };
    render(<InputPanel {...defaultProps} formData={filledForm} mode="live" />);
    const btn = screen.getByText("Generate with AI");
    expect(btn.closest("button")).not.toBeDisabled();
  });

  test("calls onGenerate when generate button is clicked", () => {
    const onGenerate = jest.fn();
    const filledForm = {
      ...defaultProps.formData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire a new employee",
    };
    render(<InputPanel {...defaultProps} formData={filledForm} onGenerate={onGenerate} />);
    fireEvent.click(screen.getByText("Generate Demo Script"));
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });

  test("shows loading state when isLoading is true", () => {
    const filledForm = {
      ...defaultProps.formData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire a new employee",
    };
    render(<InputPanel {...defaultProps} formData={filledForm} isLoading={true} />);
    expect(screen.getByText("Generating...")).toBeInTheDocument();
  });

  test("calls onFormChange when module is selected", () => {
    const onFormChange = jest.fn();
    render(<InputPanel {...defaultProps} onFormChange={onFormChange} />);
    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "HCM - Core HR" } });
    expect(onFormChange).toHaveBeenCalled();
  });

  test("shows note box when module is selected", () => {
    const filledForm = { ...defaultProps.formData, module: "HCM - Core HR" };
    render(<InputPanel {...defaultProps} formData={filledForm} />);
    expect(screen.getByText("HCM - Core HR")).toBeInTheDocument();
  });

  test("shows demo description text in demo mode", () => {
    render(<InputPanel {...defaultProps} />);
    expect(
      screen.getByText("Generate sample automation scripts using built-in templates.")
    ).toBeInTheDocument();
  });

  test("shows live AI description text in live mode", () => {
    render(<InputPanel {...defaultProps} mode="live" />);
    expect(
      screen.getByText("Generate AI-powered automation test scripts using Oracle AI Assist.")
    ).toBeInTheDocument();
  });

  test("shows 'Optional in Demo' badge for environment section", () => {
    render(<InputPanel {...defaultProps} />);
    expect(screen.getByText("Optional in Demo")).toBeInTheDocument();
  });

  test("does not show 'Optional in Demo' badge in live mode", () => {
    render(<InputPanel {...defaultProps} mode="live" />);
    expect(screen.queryByText("Optional in Demo")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. OutputPanel Component
// ---------------------------------------------------------------------------

describe("OutputPanel Component", () => {
  test("shows empty state when no result", () => {
    render(<OutputPanel result={null} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("No Script Generated Yet")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(<OutputPanel result={null} isLoading={true} error={null} mode="demo" />);
    expect(screen.getByText("Generating demo script...")).toBeInTheDocument();
  });

  test("shows live AI loading text in live mode", () => {
    render(<OutputPanel result={null} isLoading={true} error={null} mode="live" />);
    expect(
      screen.getByText("Oracle AI Assist is generating your script...")
    ).toBeInTheDocument();
  });

  test("shows error message", () => {
    render(
      <OutputPanel
        result={null}
        isLoading={false}
        error="Something went wrong"
        mode="demo"
      />
    );
    expect(screen.getByText("Generation Failed")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  test("renders script with steps", () => {
    render(
      <OutputPanel result={MOCK_RESULT} isLoading={false} error={null} mode="demo" />
    );
    expect(screen.getByText("6 steps")).toBeInTheDocument();
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  test("renders comment lines as header", () => {
    render(
      <OutputPanel result={MOCK_RESULT} isLoading={false} error={null} mode="demo" />
    );
    expect(
      screen.getByText("# Module: Financials - General Ledger")
    ).toBeInTheDocument();
  });

  test("renders copy and download buttons", () => {
    render(
      <OutputPanel result={MOCK_RESULT} isLoading={false} error={null} mode="demo" />
    );
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  test("copy button triggers clipboard write", () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
    render(
      <OutputPanel result={MOCK_RESULT} isLoading={false} error={null} mode="demo" />
    );
    fireEvent.click(screen.getByText("Copy"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(MOCK_RESULT.script);
  });

  test("shows step badges for different action types", () => {
    render(
      <OutputPanel result={MOCK_RESULT} isLoading={false} error={null} mode="demo" />
    );
    // Should have LOGIN, INPUT, CLICK, VERIFY, END badges
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
    expect(screen.getByText("END")).toBeInTheDocument();
  });

  test("shows AI Generated chip for live mode results", () => {
    const liveResult = { ...MOCK_RESULT, model: "cohere.command-r-plus" };
    render(
      <OutputPanel result={liveResult} isLoading={false} error={null} mode="live" />
    );
    expect(screen.getByText("AI Generated")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. HistoryDrawer Component
// ---------------------------------------------------------------------------

describe("HistoryDrawer Component", () => {
  const historyItem = {
    module: "HCM - Core HR",
    testType: "Functional Test",
    description: "Hire a new employee",
    result: MOCK_RESULT,
    timestamp: "3/4/2026, 10:00:00 AM",
    mode: "demo",
  };

  test("shows empty message when no history", () => {
    render(
      <HistoryDrawer
        isOpen={true}
        onClose={jest.fn()}
        history={[]}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText("No scripts generated yet.")).toBeInTheDocument();
  });

  test("renders history items", () => {
    render(
      <HistoryDrawer
        isOpen={true}
        onClose={jest.fn()}
        history={[historyItem]}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText("HCM - Core HR")).toBeInTheDocument();
    expect(screen.getByText("Functional Test")).toBeInTheDocument();
    expect(screen.getByText("Hire a new employee")).toBeInTheDocument();
  });

  test("calls onSelect and onClose when item is clicked", () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    render(
      <HistoryDrawer
        isOpen={true}
        onClose={onClose}
        history={[historyItem]}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByText("Hire a new employee"));
    expect(onSelect).toHaveBeenCalledWith(historyItem);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(
      <HistoryDrawer
        isOpen={true}
        onClose={onClose}
        history={[]}
        onSelect={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTitle("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("has open class when isOpen is true", () => {
    const { container } = render(
      <HistoryDrawer
        isOpen={true}
        onClose={jest.fn()}
        history={[]}
        onSelect={jest.fn()}
      />
    );
    expect(container.querySelector(".history-drawer.open")).toBeInTheDocument();
  });

  test("does not have open class when isOpen is false", () => {
    const { container } = render(
      <HistoryDrawer
        isOpen={false}
        onClose={jest.fn()}
        history={[]}
        onSelect={jest.fn()}
      />
    );
    expect(container.querySelector(".history-drawer.open")).not.toBeInTheDocument();
  });

  test("renders multiple history items in order", () => {
    const items = [
      { ...historyItem, description: "First item" },
      { ...historyItem, description: "Second item" },
    ];
    render(
      <HistoryDrawer
        isOpen={true}
        onClose={jest.fn()}
        history={items}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText("First item")).toBeInTheDocument();
    expect(screen.getByText("Second item")).toBeInTheDocument();
  });

  test("shows timestamp for history items", () => {
    render(
      <HistoryDrawer
        isOpen={true}
        onClose={jest.fn()}
        history={[historyItem]}
        onSelect={jest.fn()}
      />
    );
    expect(screen.getByText("3/4/2026, 10:00:00 AM")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. AutomationStep action type classification
// ---------------------------------------------------------------------------

describe("AutomationStep action type badges", () => {
  test("classifies login action", () => {
    const result = {
      ...MOCK_RESULT,
      script: "1. Login to: URL: https://env.com, Username: admin, Password: pass",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  test("classifies verify action", () => {
    const result = {
      ...MOCK_RESULT,
      script: "1. Verify the Home dashboard page is displayed.",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("VERIFY")).toBeInTheDocument();
  });

  test("classifies click action", () => {
    const result = {
      ...MOCK_RESULT,
      script: "1. Click the Navigator icon.",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("CLICK")).toBeInTheDocument();
  });

  test("classifies select action", () => {
    const result = {
      ...MOCK_RESULT,
      script: "1. Select the Ledger from the dropdown.",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("SELECT")).toBeInTheDocument();
  });

  test("classifies end of task action", () => {
    const result = {
      ...MOCK_RESULT,
      script: "1. End of Task.",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("END")).toBeInTheDocument();
  });

  test("classifies wait action", () => {
    const result = {
      ...MOCK_RESULT,
      script: "1. Wait for the page to load completely.",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("WAIT")).toBeInTheDocument();
  });

  test("classifies enter/input action", () => {
    const result = {
      ...MOCK_RESULT,
      script: '1. Enter the Journal Batch name in the field.',
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("INPUT")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. API Service Layer
// ---------------------------------------------------------------------------

describe("API Service Layer", () => {
  test("generateTestScript sends correct payload structure", async () => {
    const payload = {
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire employee",
      additionalContext: "",
      envUrl: "",
      username: "",
      password: "",
      mode: "demo",
    };
    api.generateTestScript.mockResolvedValue(MOCK_RESULT);
    const result = await api.generateTestScript(payload);
    expect(result.success).toBe(true);
    expect(result.script).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 8. Integration-like scenarios
// ---------------------------------------------------------------------------

describe("End-to-end UI scenarios", () => {
  beforeEach(() => {
    api.getConnectionStatus.mockResolvedValue(MOCK_CONNECTION_STATUS);
    api.getModules.mockResolvedValue(MOCK_MODULES);
    api.getTestTypes.mockResolvedValue(MOCK_TEST_TYPES);
    api.generateTestScript.mockResolvedValue(MOCK_RESULT);
  });

  test("empty state shows instructional steps", async () => {
    await act(async () => render(<App />));
    expect(screen.getByText("Select a module and test type")).toBeInTheDocument();
    expect(screen.getByText("Describe your test scenario")).toBeInTheDocument();
    expect(screen.getByText("Click Generate to create the script")).toBeInTheDocument();
  });

  test("app renders both panels", async () => {
    await act(async () => render(<App />));
    expect(screen.getByText("Configure Test Script")).toBeInTheDocument();
    expect(screen.getByText("No Script Generated Yet")).toBeInTheDocument();
  });
});
