# Manual Test Cases - Oracle AI Test Script Generator

## Pre-requisites
- Backend running on http://localhost:5000 (`cd backend && python app.py`)
- Frontend running on http://localhost:3000 (`cd frontend && npm start`)
- Browser: Chrome/Firefox/Edge (latest)

---

## Section 1: Application Launch & Initial State

### TC-001: Application loads successfully
**Steps:**
1. Open http://localhost:3000 in a browser

**Expected Results:**
- Page loads without errors
- Header shows "Oracle AI Test Script Generator" with subtitle "Oracle Fusion Cloud · Automated Test Scripts"
- Left panel shows "Configure Test Script" form
- Right panel shows "No Script Generated Yet" empty state
- Three instruction steps are visible: "Select a module and test type", "Describe your test scenario", "Click Generate to create the script"

---

### TC-002: Default mode is Demo
**Steps:**
1. Open the application
2. Observe the mode toggle in the header

**Expected Results:**
- Toggle switch is positioned on "Demo" (left side)
- "Demo" label is highlighted/active
- Connection badge shows "Demo Mode" or "Disconnected"
- Left panel description reads "Generate sample automation scripts using built-in templates."

---

### TC-003: Environment section shows "Optional in Demo" badge
**Steps:**
1. Open the application in Demo mode
2. Look at the Environment section in the left panel

**Expected Results:**
- "Optional in Demo" badge is displayed next to the Environment header
- Oracle Fusion URL, Username, and Password fields do NOT show red asterisks (*)
- Fields have placeholder text: URL shows "https://fa-erzp-dev22-saasfademo1.ds-fa.oraclepdemos.com/", Username shows "FUSION_USER", Password shows dots

---

## Section 2: Input Panel - Form Validation

### TC-004: Generate button disabled with empty form
**Steps:**
1. Open the application
2. Leave all fields empty
3. Observe the Generate button

**Expected Results:**
- "Generate Demo Script" button is disabled (grayed out, not clickable)

---

### TC-005: Generate button requires Module, Test Type, and Test Scenario
**Steps:**
1. Select a Module (e.g., "Financials - General Ledger") — button still disabled
2. Select a Test Type (e.g., "Functional Test") — button still disabled
3. Enter text in Test Scenario (e.g., "Create a journal entry") — button becomes enabled

**Expected Results:**
- Button remains disabled until ALL three required fields (Module, Test Type, Test Scenario) are filled
- Once all three are filled, the button turns active (teal/green color, clickable)

---

### TC-006: Module dropdown lists all 24 modules
**Steps:**
1. Click the Module dropdown
2. Scroll through all options

**Expected Results:**
- Dropdown shows "Select module..." as default placeholder
- Lists 24 modules organized by domain:
  - Financials: General Ledger, Accounts Payable, Accounts Receivable, Fixed Assets, Cash Management
  - Procurement: Purchasing, Supplier Portal, Sourcing
  - HCM: Core HR, Payroll, Talent Management, Recruitment, Benefits, Absence Management
  - SCM: Inventory Management, Order Management, Manufacturing, Logistics
  - PPM: Project Management, Project Costing
  - CX: Sales, Service
  - ERP: Tax, Intercompany

---

### TC-007: Test Type dropdown lists all 10 types
**Steps:**
1. Click the Test Type dropdown
2. Review all options

**Expected Results:**
- Dropdown shows "Select type..." as default placeholder
- Lists 10 test types: Functional Test, Integration Test, Regression Test, End-to-End Test, User Acceptance Test (UAT), Data Migration Test, Security/Role Test, Performance Test, Negative Test, Boundary Value Test

---

### TC-008: Target module note appears when module is selected
**Steps:**
1. Select "Financials - General Ledger" from the Module dropdown

**Expected Results:**
- An info note box appears below the Generate button showing: "Target: **Financials - General Ledger** — Using built-in template"

---

### TC-009: Additional Context field is optional
**Steps:**
1. Fill Module, Test Type, and Test Scenario (required fields)
2. Leave Additional Context empty
3. Click Generate

**Expected Results:**
- Script generates successfully without additional context
- No validation error for empty Additional Context

---

## Section 3: Demo Mode - Script Generation

### TC-010: Generate script for Financials - General Ledger
**Steps:**
1. Set mode to Demo
2. Enter Oracle Fusion URL: `https://fa-erzp-dev22-saasfademo1.ds-fa.oraclepdemos.com/`
3. Enter Username: `imp_scm`
4. Enter Password: `Trinamix@2024`
5. Select Module: "Financials - General Ledger"
6. Select Test Type: "Functional Test"
7. Enter Test Scenario: "Create and approve a standard invoice from a supplier"
8. Enter Additional Context: "Supplier: ABC Corporation, Invoice Amount: $10,000, Payment Terms: Net 30, Business Unit: US1"
9. Click "Generate Demo Script"

**Expected Results:**
- Button text changes to "Generating..." with a spinner
- After generation, right panel displays the script with:
  - Header comments: `# Automation Test Script`, `# Module: Financials - General Ledger`, `# Test Type: Functional Test`, `# Description:...`, `# Environment:...`
  - Step count badge (e.g., "28 steps")
  - "Demo" badge next to step count
  - Demo mode note: "Demo mode active. Set ORACLE_AI_ENDPOINT and OR..."
  - Numbered steps starting with Login step containing the provided URL, username, and password
  - Navigation to "General Accounting" under "Financials"
  - Journal-related task steps (Create Journal link, Ledger selection, etc.)
  - Sign Out steps at the end
  - Final step: "End of Task."
- Each step has a colored action badge: LOGIN (green), CLICK (blue), VERIFY (yellow), INPUT (purple), SELECT (orange), ACTION (gray), END (red)

---

### TC-011: Generate script for HCM - Core HR
**Steps:**
1. Select Module: "HCM - Core HR"
2. Select Test Type: "End-to-End Test"
3. Enter Test Scenario: "Hire a new full-time employee"
4. Enter Additional Context: "Employee: John Smith, Start Date: 01-Apr-2026, Legal Employer: US1 Legal Entity, Business Unit: US1 Business Unit, Department: Sales, Job: Sales Representative, Location: New York"
5. Click "Generate Demo Script"

**Expected Results:**
- Script contains navigation to "My Client Groups" > "Person Management"
- Steps include: Hire an Employee link, entering hire date, names, date of birth, gender, legal employer, business unit, job, department, location, salary, submit
- Steps use `<User provided>` placeholders for URL/username/password (since they were not entered)
- Step badges correctly classify each action type

---

### TC-012: Generate script for Procurement - Purchasing
**Steps:**
1. Select Module: "Procurement - Purchasing"
2. Select Test Type: "Functional Test"
3. Enter Test Scenario: "Create a purchase order for office supplies"
4. Enter Additional Context: "Supplier: Office Depot, Item: Printer Paper A4, Quantity: 500 reams, Unit Price: $5.50, Procurement BU: US1 Business Unit, Ship-to: Chicago Warehouse"
5. Click "Generate Demo Script"

**Expected Results:**
- Script navigates to "Procurement" > "Purchase Orders"
- Contains steps for creating a PO: supplier, item, quantity, unit price, UOM, submit
- Ends with sign out and "End of Task."

---

### TC-013: Generate script for SCM - Inventory Management
**Steps:**
1. Select Module: "SCM - Inventory Management"
2. Select Test Type: "Functional Test"
3. Enter Test Scenario: "Post physical inventory adjustments"
4. Enter Additional Context: "Organization: US1 Manufacturing, Subinventory: Raw Materials, Item: RM-1001, Adjustment Quantity: +50, Reason: Cycle Count Variance"
5. Click "Generate Demo Script"

**Expected Results:**
- Script navigates to "Supply Chain Execution" > "Inventory Management"
- Contains inventory-specific steps: View By, Organization selection, Physical Inventories, Post Adjustments
- Correct step numbering throughout

---

### TC-014: Generate script for SCM - Order Management
**Steps:**
1. Select Module: "SCM - Order Management"
2. Select Test Type: "Functional Test"
3. Enter Test Scenario: "Create a sales order"
4. Enter Additional Context: "Customer: Vision Corp, Bill-to Account: 1001, Ship-to Address: 100 Main St Dallas TX, Item: AS54888, Quantity: 10, UOM: Each"
5. Click "Generate Demo Script"

**Expected Results:**
- Script navigates to "Order Management" > "Order Management"
- Steps include: Create Order, Customer, Bill-to Account, Ship-to Address, Item, Quantity, Submit

---

### TC-015: Generate script for HCM - Payroll
**Steps:**
1. Select Module: "HCM - Payroll"
2. Select Test Type: "Functional Test"
3. Enter Test Scenario: "Run payroll for monthly employees"
4. Enter Additional Context: "Legislative Data Group: US1 LDG, Payroll: US1 Monthly, Pay Period: March 2026, Flow Pattern: Run Regular Payroll, Employee Group: Full-Time Salaried"
5. Click "Generate Demo Script"

**Expected Results:**
- Script navigates to "My Client Groups" > "Payroll"
- Steps include: Submit a Flow, Legislative Data Group, Payroll selection, Flow Pattern, Submit, Monitor results

---

### TC-016: Generate script for PPM - Project Management
**Steps:**
1. Select Module: "PPM - Project Management"
2. Select Test Type: "Functional Test"
3. Enter Test Scenario: "Create a new project"
4. Enter Additional Context: "Project Name: Website Redesign 2026, Project Number: PRJ-2026-001, Template: Time and Materials, Start Date: 01-Apr-2026, End Date: 30-Sep-2026, Organization: US1 Projects, Project Manager: Jane Doe"
5. Click "Generate Demo Script"

**Expected Results:**
- Script navigates to "Project Management" > "Project Management"
- Steps include: Create Project, project name, number, template, dates, organization, manager

---

### TC-017: Generate script without environment fields (Demo mode)
**Steps:**
1. Leave Oracle Fusion URL, Username, and Password empty
2. Select Module: "Financials - Accounts Payable"
3. Select Test Type: "Functional Test"
4. Enter Test Scenario: "Create an invoice"
5. Enter Additional Context: "Supplier: Global Electronics, Invoice Number: INV-20260301, Amount: $25,000, Currency: USD, Business Unit: US1"
6. Click "Generate Demo Script"

**Expected Results:**
- Script generates successfully
- Login step shows: `Login to: URL: <User provided>, Username: <User provided>, Password: <User provided>`
- All other steps generate normally

---

## Section 4: Test Type-Specific Verification Steps

### TC-018: Regression Test adds regression-specific verifications
**Steps:**
1. Select Module: "Financials - General Ledger"
2. Select Test Type: "Regression Test"
3. Enter Test Scenario: "Verify journal creation after upgrade"
4. Enter Additional Context: "Ledger: US1 Primary Ledger, Category: Manual, Currency: USD, Debit Account: 01-000-1110-0000-000, Credit Account: 01-000-2110-0000-000, Amount: $5,000"
5. Click "Generate Demo Script"

**Expected Results:**
- Script includes standard module steps PLUS regression-specific verifications:
  - "Verify no error messages are displayed on the page."
  - "Verify all data fields retain their expected values after the operation."

---

### TC-019: Integration Test adds cross-module verifications
**Steps:**
1. Select Module: "Financials - Accounts Payable"
2. Select Test Type: "Integration Test"
3. Enter Test Scenario: "Verify invoice posts to General Ledger"
4. Enter Additional Context: "Supplier: ABC Corp, Invoice: INV-5001, Amount: $15,000, GL Account: 01-000-6110-0000-000, Verify subledger journal in GL module after invoice validation"
5. Click "Generate Demo Script"

**Expected Results:**
- Script includes standard AP steps PLUS integration-specific verifications:
  - "Navigate to the related module to verify data has been passed correctly."
  - "Verify the cross-module data is consistent and accurate."

---

### TC-020: Security/Role Test adds role-based verifications
**Steps:**
1. Select Module: "HCM - Core HR"
2. Select Test Type: "Security/Role Test"
3. Enter Test Scenario: "Verify role-based access for hiring"
4. Enter Additional Context: "Role with access: HR Specialist, Role without access: Employee, Action: Hire an Employee, Legal Employer: US1 Legal Entity, Expected: HR Specialist can hire, Employee gets access denied"
5. Click "Generate Demo Script"

**Expected Results:**
- Script includes standard HCM steps PLUS security-specific verifications:
  - "Verify the action is permitted for the current user role."
  - "Sign out and sign in as a user without the required role."
  - "Repeat the same action and verify that an access denied error is displayed."

---

## Section 5: Output Panel Features

### TC-021: Copy button copies script to clipboard
**Steps:**
1. Generate any test script
2. Click the "Copy" button in the output toolbar

**Expected Results:**
- Button text changes to "Copied" with a checkmark icon
- After ~2 seconds, button reverts to "Copy"
- Paste in a text editor to verify — full script text including comments and steps should be pasted

---

### TC-022: Download button saves script as text file
**Steps:**
1. Generate any test script
2. Click the "Download" button in the output toolbar

**Expected Results:**
- Browser downloads a file named `oracle_fusion_automation_script.txt`
- Open the file — it contains the full script text matching what is displayed on screen

---

### TC-023: Step count badge is accurate
**Steps:**
1. Generate a script
2. Count the numbered steps in the output
3. Compare with the step count badge

**Expected Results:**
- The badge (e.g., "28 steps") matches the actual number of numbered steps displayed

---

### TC-024: Step action badges are correctly classified
**Steps:**
1. Generate a script and review the action badges on the right side of each step

**Expected Results:**
| Step Content | Expected Badge |
|---|---|
| "Login to: URL:..." | LOGIN (green) |
| "Click..." or "Press..." | CLICK (blue) |
| "Verify..." or "Confirm..." | VERIFY (yellow) |
| "Enter..." | INPUT (purple) |
| "Select..." | SELECT (orange) |
| "Wait..." | WAIT |
| "End of Task." | END (red) |
| Other actions | ACTION (gray) |

---

### TC-025: Script header comments display correctly
**Steps:**
1. Generate a script for Financials - General Ledger, Functional Test, with description "Create journal"

**Expected Results:**
- Gray header block at top shows:
  - `# Automation Test Script`
  - `# Module: Financials - General Ledger`
  - `# Test Type: Functional Test`
  - `# Description: Create journal`
  - `# Environment: <URL or placeholder>`

---

## Section 6: Mode Toggle (Demo ↔ Live AI)

### TC-026: Switch from Demo to Live mode
**Steps:**
1. Click the toggle switch in the header (between "Demo" and "Live AI")

**Expected Results:**
- Toggle slides to the right (Live AI position)
- "Live AI" label becomes highlighted/active
- Left panel description changes to "Generate AI-powered automation test scripts using Oracle AI Assist."
- Environment fields now show red asterisks (*) — they become required
- "Optional in Demo" badge disappears from Environment section
- Generate button text changes to "Generate with AI"
- Target module note shows "— Using Oracle AI Assist" instead of "— Using built-in template"

---

### TC-027: Live mode requires all environment fields
**Steps:**
1. Switch to Live AI mode
2. Select Module: "Financials - General Ledger"
3. Select Test Type: "Functional Test"
4. Enter Test Scenario: "Create a journal"
5. Leave URL, Username, Password empty
6. Observe the Generate button

**Expected Results:**
- "Generate with AI" button remains disabled
- Fill in URL only — still disabled
- Fill in URL + Username — still disabled
- Fill in URL + Username + Password — button becomes enabled

---

### TC-028: Switch back from Live to Demo mode
**Steps:**
1. Switch to Live AI mode
2. Click the toggle switch again to go back to Demo

**Expected Results:**
- Toggle slides back to Demo position
- "Demo" label becomes active
- Environment fields become optional again ("Optional in Demo" badge reappears)
- Generate button text changes back to "Generate Demo Script"
- Red asterisks removed from URL, Username, Password fields

---

## Section 7: History Feature

### TC-029: History is initially empty
**Steps:**
1. Open the application fresh
2. Click the "History" button in the header

**Expected Results:**
- History drawer slides in from the right
- Shows empty state: file icon with "No scripts generated yet." and "Your generation history will appear here."

---

### TC-030: Generation adds entry to history
**Steps:**
1. Generate a script (Module: "HCM - Core HR", Type: "Functional Test", Description: "Hire employee")
2. Click "History" button

**Expected Results:**
- History drawer shows one entry with:
  - Module name: "HCM - Core HR"
  - Test type: "Functional Test"
  - Description: "Hire employee"
  - Timestamp (current date/time)

---

### TC-031: Multiple generations appear in reverse chronological order
**Steps:**
1. Generate script #1 (Module: "Financials - General Ledger", Description: "Create journal")
2. Generate script #2 (Module: "HCM - Core HR", Description: "Hire employee")
3. Generate script #3 (Module: "Procurement - Purchasing", Description: "Create PO")
4. Open History drawer

**Expected Results:**
- Three entries visible
- Most recent (Procurement) is at the top
- Oldest (Financials) is at the bottom
- Each has its own timestamp

---

### TC-032: Clicking history item restores the form and output
**Steps:**
1. Generate a script for "HCM - Core HR" / "Functional Test" / "Hire employee"
2. Change the form to a different module/type
3. Open History drawer
4. Click on the "HCM - Core HR" history entry

**Expected Results:**
- History drawer closes
- Left panel form is restored: Module = "HCM - Core HR", Test Type = "Functional Test", Description = "Hire employee"
- Right panel shows the previously generated script (not regenerated — the same original output)

---

### TC-033: Close history drawer via X button
**Steps:**
1. Open History drawer
2. Click the X (close) button in the drawer header

**Expected Results:**
- Drawer slides out to the right and closes
- Background overlay disappears

---

### TC-034: Close history drawer via overlay click
**Steps:**
1. Open History drawer
2. Click on the darkened overlay area (outside the drawer)

**Expected Results:**
- Drawer closes
- Overlay disappears

---

## Section 8: Keyword Matching for Task Steps

### TC-035: Description keyword matches specific task
**Steps:**
1. Module: "Financials - General Ledger"
2. Test Scenario: "Close the accounting period" (keyword: "Close", "Period")
3. Generate

**Expected Results:**
- Script contains "Period Close" task steps: Open and Close Periods link, Ledger selection, Period Status dropdown, Close
- Does NOT show "Create Journal" steps

---

### TC-036: Description with no matching keywords falls back to first task
**Steps:**
1. Module: "Financials - General Ledger"
2. Test Scenario: "Perform a random xyz task"
3. Generate

**Expected Results:**
- Script falls back to the first available task (Create Journal)
- Still generates a complete, valid script

---

### TC-037: AP module - "payment" keyword matches Create Payment
**Steps:**
1. Module: "Financials - Accounts Payable"
2. Test Scenario: "Create a payment to supplier"
3. Generate

**Expected Results:**
- Script contains payment-specific steps: Create Payment link, Payment Process Profile, Disbursement Bank Account
- Does NOT show Create Invoice steps

---

### TC-038: AP module - "invoice" keyword matches Create Invoice
**Steps:**
1. Module: "Financials - Accounts Payable"
2. Test Scenario: "Create and validate an invoice"
3. Generate

**Expected Results:**
- Script contains invoice-specific steps: Create Invoice link, Supplier, Invoice Number, Amount, Validate

---

### TC-039: Inventory module - "transfer" keyword matches Transfer Inventory
**Steps:**
1. Module: "SCM - Inventory Management"
2. Test Scenario: "Transfer inventory between organizations"
3. Generate

**Expected Results:**
- Script contains transfer steps: Create Transfer Order, Source/Destination Organization, Item, Quantity, Subinventory

---

## Section 9: Edge Cases & Error Handling

### TC-040: Whitespace-only description is treated as empty
**Steps:**
1. Select Module and Test Type
2. Enter only spaces in Test Scenario field
3. Observe Generate button

**Expected Results:**
- Button remains disabled (whitespace-only is not a valid description)

---

### TC-041: Very long description text
**Steps:**
1. Select Module and Test Type
2. Enter a very long description (500+ characters) in Test Scenario
3. Click Generate

**Expected Results:**
- Script generates successfully
- Long description appears in the header comment section
- No truncation errors

---

### TC-042: Special characters in form fields
**Steps:**
1. Enter URL: `https://test.oracle.com/path?param=value&other=123`
2. Enter Username: `user@domain.com`
3. Enter Password: `P@ss!w0rd#$%`
4. Enter Description: `Test "quoted" & <special> chars`
5. Generate

**Expected Results:**
- All special characters appear correctly in the generated script
- No encoding errors or broken output

---

### TC-043: Rapid repeated clicking of Generate button
**Steps:**
1. Fill in all required fields
2. Click "Generate Demo Script" rapidly 5 times in succession

**Expected Results:**
- Button shows "Generating..." spinner on first click and becomes disabled
- Multiple clicks do not trigger multiple generations
- One script is generated successfully

---

### TC-044: Generate new script replaces previous script
**Steps:**
1. Generate a script for "Financials - General Ledger"
2. Change module to "HCM - Core HR" and generate again

**Expected Results:**
- Previous GL script is replaced by the new HCM script
- Step count, header comments, and steps all reflect the new HCM module
- Previous script is preserved in History

---

## Section 10: Responsive UI & Visual Checks

### TC-045: Header displays all elements correctly
**Steps:**
1. Observe the application header

**Expected Results:**
- Left side: Logo icon + "Oracle AI Test Script Generator" + subtitle
- Right side: Demo/Live AI toggle, vertical divider, History button, Connection badge
- All elements aligned and no overlapping

---

### TC-046: Two-panel layout displays correctly
**Steps:**
1. Open the application on a standard desktop browser (1280px+ width)

**Expected Results:**
- Left panel (Configure Test Script) takes approximately 1/3 of the width
- Right panel (Automation Test Script) takes approximately 2/3 of the width
- Both panels are scrollable independently if content overflows

---

### TC-047: Output panel scrolls for long scripts
**Steps:**
1. Generate a script that has many steps (e.g., HCM - Core HR hire employee ~25+ steps)
2. Scroll down in the output panel

**Expected Results:**
- Output panel scrolls smoothly
- All steps are visible when scrolling
- Toolbar (step count, Copy, Download) remains visible at the top

---

### TC-048: Dark theme is consistently applied
**Steps:**
1. Observe the overall application appearance

**Expected Results:**
- Dark navy background (#0f1117 or similar)
- Light text on dark backgrounds
- Oracle red accent color on branding elements
- Teal/green Generate button
- Colored step badges (LOGIN green, CLICK blue, VERIFY yellow, etc.)
- No white/light backgrounds that break the dark theme

---

## Section 11: All Module Coverage (Quick Smoke Tests)

For each module below, select the module, choose "Functional Test", enter a relevant description, and generate. Verify the script produces module-specific navigation and task steps.

### TC-049 to TC-060: Module smoke tests

| TC # | Module | Description | Expected Navigation |
|------|--------|-------------|-------------------|
| TC-049 | Financials - General Ledger | Create a journal | Financials > General Accounting |
| TC-050 | Financials - Accounts Payable | Create an invoice | Financials > Invoices |
| TC-051 | Financials - Accounts Receivable | Create a receipt | Financials > Billing |
| TC-052 | Financials - Fixed Assets | Register an asset | Financials > Fixed Assets |
| TC-053 | Financials - Cash Management | Bank reconciliation | Financials > Cash Management |
| TC-054 | Procurement - Purchasing | Create purchase order | Procurement > Purchase Orders |
| TC-055 | Procurement - Supplier Portal | Manage suppliers | Procurement > Supplier Portal |
| TC-056 | HCM - Core HR | Hire an employee | My Client Groups > Person Management |
| TC-057 | HCM - Payroll | Run payroll | My Client Groups > Payroll |
| TC-058 | SCM - Inventory Management | Post inventory adjustments | Supply Chain Execution > Inventory Management |
| TC-059 | SCM - Order Management | Create a sales order | Order Management > Order Management |
| TC-060 | PPM - Project Management | Create a project | Project Management > Project Management |

**Expected Results for each:**
- Script generates without errors
- Header comments reflect the selected module and test type
- Navigation steps point to the correct nav_group and nav_link
- Module-specific task steps are included
- Login and logout steps bookend the script
- "End of Task." is the final step

---

## Section 12: Backend API Direct Testing (Optional - via curl)

### TC-061: Health check endpoint
```
curl http://localhost:5000/api/health
```
**Expected:** `{"service":"OracleAI TestScript Generator","status":"healthy"}`

### TC-062: Modules endpoint
```
curl http://localhost:5000/api/modules
```
**Expected:** JSON with `modules` array containing 24 items

### TC-063: Test types endpoint
```
curl http://localhost:5000/api/test-types
```
**Expected:** JSON with `testTypes` array containing 10 items

### TC-064: Connection status endpoint
```
curl http://localhost:5000/api/connection-status
```
**Expected:** JSON with `connected`, `mode`, `message` fields; mode is "demo" without credentials

### TC-065: Generate endpoint - missing fields returns 400
```
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"module":"","testType":"","description":""}'
```
**Expected:** HTTP 400 with error message about required fields

### TC-066: Generate endpoint - valid demo request
```
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"module":"Financials - General Ledger","testType":"Functional Test","description":"Create journal","mode":"demo"}'
```
**Expected:** HTTP 200 with JSON containing `success: true`, `script`, `model: "demo-mode"`, and `note`

---

## Test Execution Summary Template

| TC # | Title | Status | Pass/Fail | Notes |
|------|-------|--------|-----------|-------|
| TC-001 | Application loads successfully | | | |
| TC-002 | Default mode is Demo | | | |
| TC-003 | Environment section shows Optional badge | | | |
| ... | ... | | | |
| TC-066 | Generate endpoint valid request | | | |

**Total Test Cases: 66**
**Tested By:** _______________
**Date:** _______________
**Environment:** _______________
**Browser:** _______________
