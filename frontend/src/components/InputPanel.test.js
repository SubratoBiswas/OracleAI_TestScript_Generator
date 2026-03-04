import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputPanel from "./InputPanel";

// =============================================================================
// InputPanel Component Test Scenarios
// =============================================================================

describe("InputPanel Component", () => {
  const modules = [
    "Financials - General Ledger",
    "Financials - Accounts Payable",
    "HCM - Core HR",
  ];
  const testTypes = ["Functional Test", "Integration Test", "Regression Test"];

  const defaultFormData = {
    module: "",
    testType: "",
    description: "",
    additionalContext: "",
    envUrl: "",
    username: "",
    password: "",
  };

  const defaultProps = {
    modules,
    testTypes,
    formData: defaultFormData,
    onFormChange: jest.fn(),
    onGenerate: jest.fn(),
    isLoading: false,
    mode: "demo",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-FE-12
  test("renders Configure Test Script title", () => {
    render(<InputPanel {...defaultProps} />);
    expect(screen.getByText("Configure Test Script")).toBeInTheDocument();
  });

  // TC-FE-13
  test("renders all module options in dropdown", () => {
    render(<InputPanel {...defaultProps} />);
    modules.forEach((mod) => {
      expect(screen.getByText(mod)).toBeInTheDocument();
    });
  });

  // TC-FE-14
  test("renders all test type options in dropdown", () => {
    render(<InputPanel {...defaultProps} />);
    testTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  // TC-FE-15
  test("renders placeholder for module selector", () => {
    render(<InputPanel {...defaultProps} />);
    expect(screen.getByText("Select module...")).toBeInTheDocument();
  });

  // TC-FE-16
  test("renders placeholder for test type selector", () => {
    render(<InputPanel {...defaultProps} />);
    expect(screen.getByText("Select type...")).toBeInTheDocument();
  });

  // TC-FE-17
  test("generate button is disabled when form is incomplete", () => {
    render(<InputPanel {...defaultProps} />);
    const btn = screen.getByRole("button", { name: /Generate/i });
    expect(btn).toBeDisabled();
  });

  // TC-FE-18
  test("generate button is enabled when required fields are filled in demo mode", () => {
    const filledFormData = {
      ...defaultFormData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire an employee",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} />);
    const btn = screen.getByRole("button", { name: /Generate/i });
    expect(btn).not.toBeDisabled();
  });

  // TC-FE-19
  test("generate button disabled in live mode without env fields", () => {
    const filledFormData = {
      ...defaultFormData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire an employee",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} mode="live" />);
    const btn = screen.getByRole("button", { name: /Generate/i });
    expect(btn).toBeDisabled();
  });

  // TC-FE-20
  test("generate button enabled in live mode with all fields filled", () => {
    const filledFormData = {
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire an employee",
      additionalContext: "",
      envUrl: "https://fusion.example.com",
      username: "admin",
      password: "secret",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} mode="live" />);
    const btn = screen.getByRole("button", { name: /Generate/i });
    expect(btn).not.toBeDisabled();
  });

  // TC-FE-21
  test("clicking generate button calls onGenerate", () => {
    const filledFormData = {
      ...defaultFormData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire an employee",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} />);
    fireEvent.click(screen.getByRole("button", { name: /Generate/i }));
    expect(defaultProps.onGenerate).toHaveBeenCalledTimes(1);
  });

  // TC-FE-22
  test("shows loading state when isLoading is true", () => {
    const filledFormData = {
      ...defaultFormData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire an employee",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} isLoading={true} />);
    expect(screen.getByText("Generating...")).toBeInTheDocument();
  });

  // TC-FE-23
  test("generate button is disabled while loading", () => {
    const filledFormData = {
      ...defaultFormData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire an employee",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} isLoading={true} />);
    const btn = screen.getByRole("button", { name: /Generating/i });
    expect(btn).toBeDisabled();
  });

  // TC-FE-24
  test("shows demo description in demo mode", () => {
    render(<InputPanel {...defaultProps} mode="demo" />);
    expect(screen.getByText(/built-in templates/)).toBeInTheDocument();
  });

  // TC-FE-25
  test("shows live description in live mode", () => {
    render(<InputPanel {...defaultProps} mode="live" />);
    expect(screen.getByText(/Oracle AI Assist/)).toBeInTheDocument();
  });

  // TC-FE-26
  test("shows Optional in Demo badge for environment section in demo mode", () => {
    render(<InputPanel {...defaultProps} mode="demo" />);
    expect(screen.getByText("Optional in Demo")).toBeInTheDocument();
  });

  // TC-FE-27
  test("shows required asterisks for env fields in live mode", () => {
    render(<InputPanel {...defaultProps} mode="live" />);
    const requiredSpans = screen.getAllByText("*");
    // Module(*), Test Type(*), Test Scenario(*), URL(*), Username(*), Password(*) = 6
    expect(requiredSpans.length).toBe(6);
  });

  // TC-FE-28
  test("calls onFormChange when module is selected", () => {
    render(<InputPanel {...defaultProps} />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "HCM - Core HR" } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith(
      expect.objectContaining({ module: "HCM - Core HR" })
    );
  });

  // TC-FE-29
  test("calls onFormChange when test type is selected", () => {
    render(<InputPanel {...defaultProps} />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "Regression Test" } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith(
      expect.objectContaining({ testType: "Regression Test" })
    );
  });

  // TC-FE-30
  test("calls onFormChange when description is entered", () => {
    render(<InputPanel {...defaultProps} />);
    const descriptionTextarea = screen.getByPlaceholderText(/Describe the task to automate/);
    fireEvent.change(descriptionTextarea, { target: { value: "Test hire flow" } });
    expect(defaultProps.onFormChange).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Test hire flow" })
    );
  });

  // TC-FE-31
  test("shows target module note when module is selected", () => {
    const filledFormData = { ...defaultFormData, module: "HCM - Core HR" };
    render(<InputPanel {...defaultProps} formData={filledFormData} />);
    const allMatches = screen.getAllByText("HCM - Core HR");
    expect(allMatches.length).toBeGreaterThanOrEqual(2); // dropdown option + note
  });

  // TC-FE-32
  test("shows demo template note when module selected in demo mode", () => {
    const filledFormData = { ...defaultFormData, module: "HCM - Core HR" };
    render(<InputPanel {...defaultProps} formData={filledFormData} mode="demo" />);
    expect(screen.getByText(/Using built-in template/)).toBeInTheDocument();
  });

  // TC-FE-33
  test("button text shows Generate Demo Script in demo mode", () => {
    const filledFormData = {
      ...defaultFormData,
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Test",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} mode="demo" />);
    expect(screen.getByText("Generate Demo Script")).toBeInTheDocument();
  });

  // TC-FE-34
  test("button text shows Generate with AI in live mode", () => {
    const filledFormData = {
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Test",
      additionalContext: "",
      envUrl: "https://test.com",
      username: "u",
      password: "p",
    };
    render(<InputPanel {...defaultProps} formData={filledFormData} mode="live" />);
    expect(screen.getByText("Generate with AI")).toBeInTheDocument();
  });
});
