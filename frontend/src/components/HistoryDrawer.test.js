import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HistoryDrawer from "./HistoryDrawer";

// =============================================================================
// HistoryDrawer Component Test Scenarios
// =============================================================================

describe("HistoryDrawer Component", () => {
  const defaultProps = {
    isOpen: false,
    onClose: jest.fn(),
    history: [],
    onSelect: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-FE-54
  test("renders Generation History title", () => {
    render(<HistoryDrawer {...defaultProps} isOpen={true} />);
    expect(screen.getByText("Generation History")).toBeInTheDocument();
  });

  // TC-FE-55
  test("shows empty state when no history", () => {
    render(<HistoryDrawer {...defaultProps} isOpen={true} />);
    expect(screen.getByText("No scripts generated yet.")).toBeInTheDocument();
    expect(screen.getByText("Your generation history will appear here.")).toBeInTheDocument();
  });

  // TC-FE-56
  test("renders history items when present", () => {
    const history = [
      {
        module: "Financials - General Ledger",
        testType: "Functional Test",
        description: "Create a journal entry for US Primary Ledger",
        timestamp: "3/4/2026, 10:00:00 AM",
        result: { success: true, script: "1. Login" },
      },
    ];
    render(<HistoryDrawer {...defaultProps} isOpen={true} history={history} />);
    expect(screen.getByText("Financials - General Ledger")).toBeInTheDocument();
    expect(screen.getByText("Functional Test")).toBeInTheDocument();
    expect(screen.getByText("Create a journal entry for US Primary Ledger")).toBeInTheDocument();
  });

  // TC-FE-57
  test("renders multiple history items", () => {
    const history = [
      {
        module: "HCM - Core HR",
        testType: "End-to-End Test",
        description: "Hire employee",
        timestamp: "3/4/2026, 10:30:00 AM",
        result: { success: true, script: "1. Login" },
      },
      {
        module: "Financials - General Ledger",
        testType: "Functional Test",
        description: "Create journal",
        timestamp: "3/4/2026, 10:00:00 AM",
        result: { success: true, script: "1. Login" },
      },
    ];
    render(<HistoryDrawer {...defaultProps} isOpen={true} history={history} />);
    expect(screen.getByText("HCM - Core HR")).toBeInTheDocument();
    expect(screen.getByText("Financials - General Ledger")).toBeInTheDocument();
  });

  // TC-FE-58
  test("clicking a history item calls onSelect and onClose", () => {
    const historyItem = {
      module: "HCM - Core HR",
      testType: "Functional Test",
      description: "Hire employee",
      timestamp: "3/4/2026, 10:00:00 AM",
      result: { success: true, script: "1. Login" },
    };
    render(
      <HistoryDrawer {...defaultProps} isOpen={true} history={[historyItem]} />
    );
    fireEvent.click(screen.getByText("HCM - Core HR"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(historyItem);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // TC-FE-59
  test("clicking close button calls onClose", () => {
    render(<HistoryDrawer {...defaultProps} isOpen={true} />);
    const closeBtn = screen.getByTitle("Close");
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // TC-FE-60
  test("clicking overlay calls onClose", () => {
    const { container } = render(<HistoryDrawer {...defaultProps} isOpen={true} />);
    const overlay = container.querySelector(".overlay");
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // TC-FE-61
  test("displays timestamp for history items", () => {
    const history = [
      {
        module: "HCM - Core HR",
        testType: "Functional Test",
        description: "Hire employee",
        timestamp: "3/4/2026, 2:15:00 PM",
        result: { success: true, script: "1. Login" },
      },
    ];
    render(<HistoryDrawer {...defaultProps} isOpen={true} history={history} />);
    expect(screen.getByText("3/4/2026, 2:15:00 PM")).toBeInTheDocument();
  });

  // TC-FE-62
  test("drawer has open class when isOpen is true", () => {
    const { container } = render(<HistoryDrawer {...defaultProps} isOpen={true} />);
    expect(container.querySelector(".history-drawer.open")).toBeInTheDocument();
  });

  // TC-FE-63
  test("drawer does not have open class when isOpen is false", () => {
    const { container } = render(<HistoryDrawer {...defaultProps} isOpen={false} />);
    expect(container.querySelector(".history-drawer.open")).not.toBeInTheDocument();
  });
});
