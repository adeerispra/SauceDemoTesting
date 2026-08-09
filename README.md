# SauceDemo Jira-Driven Manual E2E QA Agent

This repository demonstrates an agent-assisted manual QA workflow for the SauceDemo e-commerce demo application. It is designed as a portfolio project showing how a QA agent can react to a Jira ticket moving into testing, generate structured test cases, execute browser-based end-to-end checks, collect video evidence, and report the result back to Jira.

> Target application: https://www.saucedemo.com/

## Problem Being Solved

Manual regression testing often breaks down because test cases, execution evidence, and Jira updates are handled in separate places. This project keeps that workflow explicit and repeatable:

1. A Jira issue is moved to `Ready for Testing`.
2. A local webhook receives the Jira event.
3. The QA agent reads product context and flow documentation.
4. The agent generates Excel test cases for the ticket.
5. The agent executes the relevant SauceDemo flows in a browser.
6. Each test case is recorded as evidence.
7. Test results and evidence links are posted back to Jira.

## Tech Stack

| Area | Tooling |
|---|---|
| Runtime | Node.js |
| Webhook | Native Node HTTP server |
| Agent runtime | Claude CLI workflow instructions |
| Browser execution | `agent-browser` |
| Test case output | ExcelJS |
| Agent tool integration | Model Context Protocol (MCP) |
| Work management | Jira webhook + Jira API attachment upload |

## Architecture

```text
Jira status transition
        |
        v
POST /webhook
        |
        v
Webhook validates secret, issue key, and target status
        |
        v
QA agent receives Jira ticket URL
        |
        v
Reads rules/ and test-context/
        |
        v
Generates Excel test cases with MCP
        |
        v
Runs SauceDemo manual E2E browser checks
        |
        v
Saves .webm evidence per test case
        |
        v
Uploads evidence and posts Jira result comment
```

## Repository Structure

```text
.
├── AGENTS.md                     # QA agent runtime policy
├── CLAUDE.md                     # Full execution workflow for Claude CLI
├── index.js                      # Jira webhook receiver
├── mcp-server.mjs                # MCP tool for Excel test case generation
├── package.json
├── rules/
│   ├── browser-automation.md     # Browser session and recording rules
│   ├── jira-reporting.md         # Evidence upload and Jira comment rules
│   ├── saucedemo-context.md      # Quick product and environment context
│   └── test-case-generation.md   # Test case generation standard
├── samples/
│   └── jira-ready-for-testing-webhook.json
└── test-context/
    ├── environment.md
    ├── known-issues.md
    └── flows/                    # SauceDemo flow documentation
```

Generated artifacts are intentionally ignored by Git:

```text
tc_template/       # Generated Excel test case files
Testing Result/    # Video recordings per test case
```

## Jira Workflow

The webhook is intended to run when a Jira issue transitions into the configured target status.

Default target status:

```text
Ready for Testing
```

The target status can be changed with:

```bash
TARGET_JIRA_STATUS="Ready for Testing"
```

Webhook behavior:

- Rejects invalid JSON payloads.
- Optionally validates `x-webhook-secret`.
- Requires `JIRA_BASE_URL`.
- Ignores Jira events that are not in the target status.
- Starts the QA agent only when the issue is ready for testing.

## Setup

Install dependencies:

```bash
npm install
```

Create local environment config:

```bash
cp .env.example .env
```

Fill in:

```text
JIRA_BASE_URL
JIRA_EMAIL
JIRA_API_TOKEN
WEBHOOK_SECRET
TARGET_JIRA_STATUS
CLAUDE_SKIP_PERMISSIONS
```

Install browser execution tooling:

```bash
npm install -g agent-browser
agent-browser install
```

## Running Locally

Start the Jira webhook receiver:

```bash
npm start
```

Webhook endpoint:

```text
POST http://127.0.0.1:3000/webhook
```

Example local request:

```bash
curl -X POST "http://127.0.0.1:3000/webhook" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: change-me" \
  --data @samples/jira-ready-for-testing-webhook.json
```

Start the MCP test case generator when configuring the agent runtime:

```bash
npm run start:mcp
```

## Test Execution Standard

The agent must follow this order for each Jira ticket:

1. Read `rules/saucedemo-context.md`, `rules/browser-automation.md`, `rules/test-case-generation.md`, `rules/jira-reporting.md`, and relevant files under `test-context/flows/`.
2. Generate Excel test cases in `tc_template/{TICKET_ID}_Test_Cases.xlsx`.
3. Execute each test case in a fresh browser session.
4. Record one `.webm` file per test case under `Testing Result/`.
5. Update the Excel file with `Passed`, `Failed`, or `Untested`.
6. Upload recordings to Jira.
7. Post one Jira comment with the result table and evidence links.

## SauceDemo Coverage

Documented flows include:

- Login and negative login states
- Product listing
- Product detail
- Cart management
- Checkout information validation
- Checkout overview and order confirmation
- Navigation menu
- User-specific behaviors
- Sorting and filtering
- End-to-end order flow

## Known Limitations

SauceDemo is a demo application:

- There is only one public environment.
- Orders are simulated.
- Payment and shipping values are hardcoded.
- Cart state is session-based.
- Some users intentionally expose bugs for QA practice.

See `test-context/known-issues.md` for detailed notes.

## Security Notes

- Do not commit `.env`.
- Do not commit real Jira API tokens.
- `Testing Result/` may contain video evidence and should be reviewed before sharing.
- Keep `CLAUDE_SKIP_PERMISSIONS=false` unless running in a trusted local sandbox.
