# Oracle AI Test Script Generator

A web application for generating AI-powered Oracle Fusion Cloud test scripts using Oracle AI Assist.

## Architecture

```
frontend/          React 18 single-page application
backend/           Flask REST API with Oracle AI Assist integration
```

## Features

- **Module Selection** - Choose from 24+ Oracle Fusion Cloud modules (Financials, Procurement, HCM, SCM, PPM, CX)
- **Test Type Selection** - Functional, Integration, Regression, End-to-End, UAT, and more
- **AI-Powered Generation** - Connects to Oracle AI Assist to generate detailed test scripts
- **Structured Output** - Generated scripts include test steps, navigation paths, expected results, and validation checkpoints
- **Copy & Download** - Copy scripts to clipboard or download as Markdown files
- **Generation History** - Browse and reload previously generated scripts
- **Demo Mode** - Works without Oracle AI credentials using built-in demo generation

## Prerequisites

- Python 3.9+
- Node.js 18+
- Oracle AI Assist API credentials (optional - runs in demo mode without them)

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows
pip install -r requirements.txt
cp .env.example .env            # Edit with your Oracle AI credentials
python app.py
```

The backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and proxies API requests to the backend.

## Configuration

Copy `backend/.env.example` to `backend/.env` and set your Oracle AI Assist credentials:

| Variable                    | Description                                  |
|-----------------------------|----------------------------------------------|
| `ORACLE_AI_ENDPOINT`        | Oracle AI Generative AI service endpoint URL |
| `ORACLE_AI_API_KEY`         | API key for authentication                   |
| `ORACLE_AI_COMPARTMENT_ID`  | OCI compartment OCID                         |
| `ORACLE_AI_MODEL_ID`        | Model OCID for the generative AI model       |
| `FLASK_SECRET_KEY`          | Secret key for Flask session security        |

## API Endpoints

| Method | Endpoint                 | Description                         |
|--------|--------------------------|-------------------------------------|
| GET    | `/api/health`            | Health check                        |
| GET    | `/api/connection-status` | Oracle AI connection status         |
| GET    | `/api/modules`           | List available Oracle Fusion modules|
| GET    | `/api/test-types`        | List available test types           |
| POST   | `/api/generate`          | Generate a test script              |

### POST `/api/generate` Request Body

```json
{
  "module": "Financials - Accounts Payable",
  "testType": "Functional Test",
  "description": "Create and approve a standard invoice",
  "additionalContext": "Use supplier ABC Corp, amount $5,000"
}
```
