import json
import requests
from config import Config


# Mapping of Oracle Fusion modules to their navigation paths and common tasks
FUSION_MODULE_NAVIGATION = {
    "Financials - General Ledger": {
        "nav_group": "Financials",
        "nav_link": "General Accounting",
        "tasks": {
            "Create Journal": [
                "Click the Tasks panel icon on the right side of the page.",
                "Click the Create Journal link under Journals.",
                'Select the Ledger from the Ledger dropdown (e.g., "US Primary Ledger").',
                "Enter the Journal Batch name.",
                "Select the Category from the Category dropdown.",
                "Enter the Accounting Date.",
                'Click the "Add Row" button to add journal lines.',
                "Enter the Account combination in the Account field for Line 1.",
                "Enter the Debit amount.",
                'Click "Add Row" again to add a second line.',
                "Enter the Account combination for Line 2.",
                "Enter the Credit amount (must equal total debits).",
                "Verify the batch total shows Debits equal Credits.",
                'Click the "Post" button to post the journal.',
                'Click "OK" on the confirmation dialog.',
                "Verify the journal Status changes to Posted.",
            ],
            "Period Close": [
                "Click the Tasks panel icon on the right side of the page.",
                "Click the Open and Close Periods link.",
                "Select the Ledger from the Ledger dropdown.",
                "Locate the current open period in the list.",
                'Click on the Period Status dropdown and select "Close".',
                "Click the Save button.",
                'Click "OK" on the confirmation dialog.',
                "Verify the Period Status changes to Closed.",
            ],
        },
    },
    "Financials - Accounts Payable": {
        "nav_group": "Financials",
        "nav_link": "Invoices",
        "tasks": {
            "Create Invoice": [
                "Click the Tasks panel icon on the right side of the page.",
                "Click the Create Invoice link.",
                'Select the Business Unit from the Business Unit dropdown (e.g., "US1 Business Unit").',
                "Enter or search for the Supplier name in the Supplier field.",
                "Enter the Supplier Site.",
                "Enter the Invoice Number.",
                "Enter the Invoice Amount.",
                "Enter the Invoice Date.",
                "Select the Payment Terms from the dropdown.",
                "Click on the Invoice Lines section to expand it.",
                'Click "Add Row" to add an invoice line.',
                "Enter the Line Amount.",
                "Enter the Distribution Combination (GL Account).",
                "Verify the line total matches the invoice header amount.",
                'Click the "Save" button.',
                "Verify the invoice is saved with status Unpaid/Unvalidated.",
                'Click "Validate" from the Actions menu.',
                "Verify the invoice status changes to Validated.",
            ],
            "Create Payment": [
                "Click the Tasks panel icon on the right side of the page.",
                "Click the Create Payment link under Payments.",
                "Select the Business Unit.",
                "Select the Payment Process Profile.",
                "Select the Disbursement Bank Account.",
                "Enter or search the Supplier name.",
                "Enter the Payment Amount.",
                "Enter the Payment Date.",
                'Click "Save and Close" to save the payment.',
                "Verify the payment record is created successfully.",
            ],
        },
    },
    "Financials - Accounts Receivable": {
        "nav_group": "Financials",
        "nav_link": "Billing",
        "tasks": {
            "Create Receipt": [
                "Click the Tasks panel icon on the right side of the page.",
                "Click the Create Receipt link under Receipts.",
                "Select the Business Unit.",
                "Select the Receipt Method.",
                "Enter the Receipt Amount.",
                "Enter the Receipt Date.",
                "Enter or search the Customer name.",
                'Click "Apply" to apply the receipt to an open invoice.',
                "Select the invoice to apply against.",
                "Enter the Applied Amount.",
                'Click "Save and Close".',
                "Verify the receipt is created and applied successfully.",
            ],
        },
    },
    "Procurement - Purchasing": {
        "nav_group": "Procurement",
        "nav_link": "Purchase Orders",
        "tasks": {
            "Create Purchase Order": [
                "Click the Tasks panel icon on the right side of the page.",
                "Click the Create Order link.",
                "Select the Procurement BU from the dropdown.",
                "Enter or search the Supplier name in the Supplier field.",
                "Select the Supplier Site.",
                "Verify the Bill-to and Ship-to locations are defaulted.",
                'Click "Add" to add a purchase order line.',
                "Enter the Item description or Item number.",
                "Enter the Quantity.",
                "Enter the Unit Price.",
                "Select the UOM (Unit of Measure).",
                "Enter the Deliver-to Location.",
                "Verify the line total is calculated correctly.",
                'Click "Submit" to submit the purchase order.',
                'Click "OK" on the confirmation dialog.',
                "Verify the PO Status changes to Pending Approval or Approved.",
            ],
        },
    },
    "HCM - Core HR": {
        "nav_group": "My Client Groups",
        "nav_link": "Person Management",
        "tasks": {
            "Hire Employee": [
                'Click the "Hire an Employee" link.',
                "Enter the Hire Date.",
                "Enter the Last Name.",
                "Enter the First Name.",
                "Select the Date of Birth.",
                "Select the Gender.",
                "Select the Legislative Data Group.",
                'Click "Continue".',
                "Enter the Legal Employer.",
                "Enter the Business Unit.",
                "Select the Job from the Job dropdown.",
                "Select the Department.",
                "Select the Location.",
                "Enter the Assignment Category.",
                'Click "Continue" to proceed to compensation.',
                "Enter the Salary Amount.",
                "Select the Salary Basis.",
                'Click "Continue" to review.',
                "Verify all entered data on the review page.",
                'Click "Submit" to complete the hire.',
                'Click "OK" on the confirmation dialog.',
                "Verify the worker is created and displays in the directory.",
            ],
        },
    },
    "HCM - Payroll": {
        "nav_group": "My Client Groups",
        "nav_link": "Payroll",
        "tasks": {
            "Run Payroll": [
                "Click the Tasks panel icon.",
                "Click the Submit a Flow link under Payroll Processing.",
                "Select the Legislative Data Group.",
                "Select the Payroll.",
                'Select the Flow Pattern (e.g., "Calculate and Validate Payroll").',
                "Enter the effective date.",
                "Select the Payroll Period.",
                'Click "Submit".',
                'Click "OK" on the confirmation dialog.',
                "Monitor the process status until it shows Completed.",
                "Click the View Results link.",
                "Verify employee payroll calculations are correct.",
                "Verify deductions and earnings are applied properly.",
            ],
        },
    },
    "SCM - Inventory Management": {
        "nav_group": "Supply Chain Execution",
        "nav_link": "Inventory Management",
        "tasks": {
            "Post Physical Inventory Adjustments": [
                "Click View By, select the required Inventory Organization, and click Apply.",
                "Click the Task Pane icon, then from Show Tasks select Counts.",
                "Click the Manage Physical Inventories link.",
                "Select the Organization from the dropdown list and click OK.",
                "Enter the Physical Inventory Name.",
                "Click the Search button.",
                "Select the Physical Inventory record from the results.",
                "Click the Actions dropdown and select Post Physical Inventory Adjustments.",
                "Confirm the Adjustment Date defaulted.",
                "Click OK to submit.",
            ],
            "Transfer Inventory": [
                "Click View By, select the required Inventory Organization, and click Apply.",
                "Click the Task Pane icon, then from Show Tasks select Transfers.",
                "Click the Create Transfer Order link.",
                "Select the Source Organization.",
                "Select the Destination Organization.",
                "Enter the Item Number.",
                "Enter the Quantity to transfer.",
                "Select the Source Subinventory.",
                "Select the Destination Subinventory.",
                'Click "Submit" to create the transfer order.',
                "Verify the transfer order is created successfully.",
            ],
        },
    },
    "SCM - Order Management": {
        "nav_group": "Order Management",
        "nav_link": "Order Management",
        "tasks": {
            "Create Sales Order": [
                "Click the Tasks panel icon.",
                "Click the Create Order link.",
                "Enter or search the Customer name in the Customer field.",
                "Select the Bill-to Account.",
                "Select the Ship-to Address.",
                'Click "Add" to add an order line.',
                "Enter the Item Number.",
                "Enter the Ordered Quantity.",
                "Verify the Unit Price defaults from the price list.",
                "Verify the Line Total is calculated.",
                'Click "Submit" to submit the order.',
                'Click "OK" on the confirmation dialog.',
                "Verify the order status changes to Processing or Booked.",
            ],
        },
    },
    "PPM - Project Management": {
        "nav_group": "Project Management",
        "nav_link": "Project Management",
        "tasks": {
            "Create Project": [
                "Click the Tasks panel icon.",
                "Click the Create Project link.",
                "Enter the Project Name.",
                "Enter the Project Number (if not auto-generated).",
                "Select the Project Template.",
                "Enter the Project Start Date.",
                "Enter the Project Finish Date.",
                "Select the Project Organization.",
                "Select the Project Manager.",
                "Enter the project description in the Description field.",
                'Click "Save and Close".',
                "Verify the project is created with Draft status.",
                'Select the project and click "Change Status" to Active.',
                "Verify the project status changes to Active.",
            ],
        },
    },
}


class OracleAIClient:
    """Client for communicating with Oracle AI Assist API."""

    def __init__(self):
        self.endpoint = Config.ORACLE_AI_ENDPOINT
        self.api_key = Config.ORACLE_AI_API_KEY
        self.compartment_id = Config.ORACLE_AI_COMPARTMENT_ID
        self.model_id = Config.ORACLE_AI_MODEL_ID

    def _get_headers(self):
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

    def _build_prompt(self, module, test_type, description, additional_context,
                      env_url, username, password):
        """Build a structured prompt for automation-ready test script generation."""
        prompt = f"""You are an expert Oracle Fusion Cloud test automation engineer.
Generate a step-by-step AUTOMATION test script that an AI testing tool can execute
directly against the Oracle Fusion Cloud UI.

**Module:** {module}
**Test Type:** {test_type}
**Test Description:** {description}
**Environment URL:** {env_url}
**Username:** {username}
**Password:** {password}
"""
        if additional_context:
            prompt += f"\n**Additional Context:** {additional_context}\n"

        prompt += """
CRITICAL: Generate the script as a NUMBERED LIST of precise, atomic UI actions.
Each step must be a single action that an AI bot can execute. Use this exact format:

1. Login to: URL: <environment_url>, Username: <username>, Password: <password>
2. Click in the User ID field and enter your User ID.
3. Click in the Password field and enter your Password.
4. Press the Sign In button.
5. Click the Navigator link.
6. Under <Navigation Group>, click the <Module Link> link.
...continue with precise click, enter, select, verify actions...
N. End of Task.

Rules for each step:
- Each step must be ONE atomic UI action: click, enter, select, press, verify, wait, scroll
- Use exact Oracle Fusion UI element names (buttons, links, fields, dropdowns, tabs)
- Include navigation paths: "Under Supply Chain Execution, click the Inventory Management link"
- For data entry: "Click in the <Field Name> field and enter <value>"
- For dropdowns: "Select <value> from the <Dropdown Name> dropdown"
- For buttons: "Click the <Button Name> button" or "Press the <Button Name> button"
- For verification: "Verify that <element> displays <expected value>"
- Include "End of Task." as the final step
- Do NOT include manual/human instructions like "take screenshots" or "document results"
- Do NOT include section headers, markdown formatting, or bullet points - ONLY numbered steps
"""
        return prompt

    def generate_test_script(self, module, test_type, description,
                             additional_context="", env_url="",
                             username="", password="", force_demo=False):
        """Generate an automation test script using Oracle AI Assist."""
        prompt = self._build_prompt(module, test_type, description,
                                    additional_context, env_url, username, password)

        if force_demo or not self.endpoint or not self.api_key:
            return self._generate_demo_response(module, test_type, description,
                                                env_url, username, password)

        payload = {
            "compartmentId": self.compartment_id,
            "servingMode": {
                "servingType": "ON_DEMAND",
                "modelId": self.model_id,
            },
            "chatRequest": {
                "apiFormat": "GENERIC",
                "messages": [
                    {
                        "role": "USER",
                        "content": [{"type": "TEXT", "text": prompt}],
                    }
                ],
                "maxTokens": 4096,
                "temperature": 0.3,
            },
        }

        try:
            response = requests.post(
                f"{self.endpoint}/20231130/actions/chat",
                headers=self._get_headers(),
                json=payload,
                timeout=60,
            )
            response.raise_for_status()
            result = response.json()

            chat_response = result.get("chatResponse", {})
            choices = chat_response.get("choices", [])
            if choices:
                message = choices[0].get("message", {})
                content = message.get("content", [])
                if content:
                    return {
                        "success": True,
                        "script": content[0].get("text", ""),
                        "model": self.model_id,
                    }

            return {"success": False, "error": "No response content from Oracle AI."}

        except requests.exceptions.ConnectionError:
            return {"success": False, "error": "Cannot connect to Oracle AI endpoint. Check your configuration."}
        except requests.exceptions.Timeout:
            return {"success": False, "error": "Request to Oracle AI timed out. Please try again."}
        except requests.exceptions.HTTPError as e:
            return {"success": False, "error": f"Oracle AI API error: {e.response.status_code} - {e.response.text}"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}"}

    def _generate_demo_response(self, module, test_type, description,
                                env_url, username, password):
        """Generate a demo automation script when Oracle AI credentials are not configured."""
        env_url = env_url or "<User provided>"
        username = username or "<User provided>"
        password = password or "<User provided>"

        # Look up module-specific navigation and steps
        module_info = FUSION_MODULE_NAVIGATION.get(module, {})
        nav_group = module_info.get("nav_group", module.split(" - ")[0] if " - " in module else module)
        nav_link = module_info.get("nav_link", module.split(" - ")[1] if " - " in module else module)
        tasks = module_info.get("tasks", {})

        # Find the best matching task based on description keywords
        task_steps = []
        desc_lower = description.lower()
        for task_name, steps in tasks.items():
            if any(word in desc_lower for word in task_name.lower().split()):
                task_steps = steps
                break
        if not task_steps and tasks:
            task_steps = list(tasks.values())[0]

        # Build the automation script
        step_num = 1
        lines = []

        # Header comment
        lines.append(f"# Automation Test Script")
        lines.append(f"# Module: {module}")
        lines.append(f"# Test Type: {test_type}")
        lines.append(f"# Description: {description}")
        lines.append(f"# Environment: {env_url}")
        lines.append("")

        # Login steps
        lines.append(f"{step_num}. Login to: URL: {env_url}, Username: {username}, Password: {password}")
        step_num += 1
        lines.append(f"{step_num}. Click in the User ID field and enter \"{username}\".")
        step_num += 1
        lines.append(f"{step_num}. Click in the Password field and enter \"{password}\".")
        step_num += 1
        lines.append(f"{step_num}. Press the Sign In button.")
        step_num += 1
        lines.append(f"{step_num}. Verify the Home dashboard page is displayed.")
        step_num += 1

        # Navigation
        lines.append(f"{step_num}. Click the Navigator icon (hamburger menu) in the top-left corner.")
        step_num += 1
        lines.append(f"{step_num}. Under {nav_group}, click the {nav_link} link.")
        step_num += 1
        lines.append(f"{step_num}. Verify the {nav_link} landing page is displayed.")
        step_num += 1

        # Module-specific steps
        for action in task_steps:
            lines.append(f"{step_num}. {action}")
            step_num += 1

        # Verification steps based on test type
        if "regression" in test_type.lower():
            lines.append(f"{step_num}. Verify no error messages are displayed on the page.")
            step_num += 1
            lines.append(f"{step_num}. Verify all data fields retain their expected values after the operation.")
            step_num += 1
        elif "integration" in test_type.lower():
            lines.append(f"{step_num}. Navigate to the related module to verify data has been passed correctly.")
            step_num += 1
            lines.append(f"{step_num}. Verify the cross-module data is consistent and accurate.")
            step_num += 1
        elif "security" in test_type.lower() or "role" in test_type.lower():
            lines.append(f"{step_num}. Verify the action is permitted for the current user role.")
            step_num += 1
            lines.append(f"{step_num}. Sign out and sign in as a user without the required role.")
            step_num += 1
            lines.append(f"{step_num}. Repeat the same action and verify that an access denied error is displayed.")
            step_num += 1

        # Logout
        lines.append(f"{step_num}. Click the User icon in the top-right corner.")
        step_num += 1
        lines.append(f"{step_num}. Click the Sign Out link.")
        step_num += 1
        lines.append(f"{step_num}. Verify the Sign In page is displayed.")
        step_num += 1
        lines.append(f"{step_num}. End of Task.")

        script = "\n".join(lines)

        return {
            "success": True,
            "script": script,
            "model": "demo-mode",
            "note": "Demo mode active. Set ORACLE_AI_ENDPOINT and ORACLE_AI_API_KEY in .env for live AI generation.",
        }

    def validate_connection(self):
        """Check if Oracle AI Assist is reachable."""
        if not self.endpoint or not self.api_key:
            return {
                "connected": False,
                "mode": "demo",
                "message": "Oracle AI credentials not configured. Running in demo mode.",
            }

        try:
            response = requests.get(
                f"{self.endpoint}/20231130/models",
                headers=self._get_headers(),
                timeout=10,
            )
            return {
                "connected": response.status_code == 200,
                "mode": "live",
                "message": "Connected to Oracle AI Assist." if response.status_code == 200
                else f"Connection issue: HTTP {response.status_code}",
            }
        except Exception as e:
            return {
                "connected": False,
                "mode": "error",
                "message": f"Connection failed: {str(e)}",
            }
