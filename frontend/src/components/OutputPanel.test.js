import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OutputPanel from "./OutputPanel";

// =============================================================================
// OutputPanel Component Test Scenarios
// =============================================================================

describe("OutputPanel Component", () => {
  // TC-FE-35
  test("shows empty state when no result", () => {
    render(<OutputPanel result={null} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("No Script Generated Yet")).toBeInTheDocument();
  });

  // TC-FE-36
  test("shows instruction steps in empty state", () => {
    render(<OutputPanel result={null} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("Select a module and test type")).toBeInTheDocument();
    expect(screen.getByText("Describe your test scenario")).toBeInTheDocument();
    expect(screen.getByText("Click Generate to create the script")).toBeInTheDocument();
  });

  // TC-FE-37
  test("shows loading spinner when isLoading is true", () => {
    render(<OutputPanel result={null} isLoading={true} error={null} mode="demo" />);
    expect(screen.getByText("Generating demo script...")).toBeInTheDocument();
  });

  // TC-FE-38
  test("shows AI loading message in live mode", () => {
    render(<OutputPanel result={null} isLoading={true} error={null} mode="live" />);
    expect(screen.getByText("Oracle AI Assist is generating your script...")).toBeInTheDocument();
  });

  // TC-FE-39
  test("shows error message when error is present", () => {
    render(
      <OutputPanel result={null} isLoading={false} error="Something went wrong" mode="demo" />
    );
    expect(screen.getByText("Generation Failed")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  // TC-FE-40
  test("renders generated script with steps", () => {
    const result = {
      success: true,
      script: "# Automation Test Script\n# Module: GL\n1. Login to: URL\n2. Click Navigator\n3. End of Task.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("3 steps")).toBeInTheDocument();
  });

  // TC-FE-41
  test("renders header comments from script", () => {
    const result = {
      success: true,
      script: "# Automation Test Script\n# Module: GL\n1. Login to: URL",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("# Automation Test Script")).toBeInTheDocument();
    expect(screen.getByText("# Module: GL")).toBeInTheDocument();
  });

  // TC-FE-42
  test("shows Demo chip for demo-mode model", () => {
    const result = {
      success: true,
      script: "1. Login to: URL\n2. End of Task.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  // TC-FE-43
  test("shows AI Generated chip for non-demo model", () => {
    const result = {
      success: true,
      script: "1. Login to: URL\n2. End of Task.",
      model: "cohere.command-r-plus",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="live" />);
    expect(screen.getByText("AI Generated")).toBeInTheDocument();
  });

  // TC-FE-44
  test("renders Copy button", () => {
    const result = {
      success: true,
      script: "1. Login to: URL\n2. End of Task.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  // TC-FE-45
  test("renders Download button", () => {
    const result = {
      success: true,
      script: "1. Login to: URL\n2. End of Task.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  // TC-FE-46
  test("classifies login step correctly", () => {
    const result = {
      success: true,
      script: "1. Login to: URL: https://test.com, Username: user, Password: pass",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  // TC-FE-47
  test("classifies verify step correctly", () => {
    const result = {
      success: true,
      script: "1. Verify the Home page is displayed.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("VERIFY")).toBeInTheDocument();
  });

  // TC-FE-48
  test("classifies click step correctly", () => {
    const result = {
      success: true,
      script: "1. Click the Navigator icon.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("CLICK")).toBeInTheDocument();
  });

  // TC-FE-49
  test("classifies input/enter step correctly", () => {
    const result = {
      success: true,
      script: '1. Enter "TESTUSER" in the Username field.',
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("INPUT")).toBeInTheDocument();
  });

  // TC-FE-50
  test("classifies select step correctly", () => {
    const result = {
      success: true,
      script: "1. Select the Ledger from the dropdown.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("SELECT")).toBeInTheDocument();
  });

  // TC-FE-51
  test("classifies end of task step correctly", () => {
    const result = {
      success: true,
      script: "1. End of Task.",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("END")).toBeInTheDocument();
  });

  // TC-FE-52
  test("shows note when present in result", () => {
    const result = {
      success: true,
      script: "1. Login to: URL\n2. End of Task.",
      model: "demo-mode",
      note: "Demo mode active. Set credentials for live mode.",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText(/Demo mode active/)).toBeInTheDocument();
  });

  // TC-FE-53
  test("displays correct step count", () => {
    const result = {
      success: true,
      script: "# Header\n1. Step one\n2. Step two\n3. Step three\n4. Step four\n5. Step five",
      model: "demo-mode",
    };
    render(<OutputPanel result={result} isLoading={false} error={null} mode="demo" />);
    expect(screen.getByText("5 steps")).toBeInTheDocument();
  });
});
