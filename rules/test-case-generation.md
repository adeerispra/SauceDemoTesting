---
description: Standards for generating test cases for the SauceDemo project
alwaysApply: false
---

# Test Case Generation — SauceDemo Standards

When asked to create test cases, always follow this workflow and format.

## Workflow

1. **Identify the feature or flow** to be tested (e.g. "Login", "Checkout", "Cart")
2. **Read the relevant flow file(s)** from `test-context/flows/` for context and edge cases
3. **Read `test-context/known-issues.md`** — skip or note test cases that are blocked by known limitations
4. **Check existing test cases** in `tc_template/` — never duplicate existing TCs
5. **Output as Excel** to `tc_template/<TICKET_OR_FEATURE>_Test_Cases.xlsx`

## Excel Format

- **Sheet name**: `<FEATURE> Test Cases`
- **Columns**: `Test Case ID | Type | Title | Preconditions | Steps | Expected Result | Status`
- **Header**: `#4A4A4A` background, white bold font, size 11, center + wrap aligned, height 25
- **Data rows**: No fixed height (`auto_size = True`), thin border all sides, font size 11, wrap text top-aligned
- **Column widths**: A=15, B=15, C=30, D=35, E=50, F=40, G=15
- **Type values**: `Positive`, `Negative`, or `Edge Case`
- **Status dropdown**: `"Passed,Failed,Untested"` applied to `G2:G1000`
- **No freeze panes**

## Test Case IDs

Format: `TC-001`, `TC-002`, etc. — zero-padded to 3 digits.

## Preconditions

Always include:
- The target URL: `https://www.saucedemo.com/`
- The test user to use (e.g. `standard_user / secret_sauce`)
- Initial cart state (e.g. "Cart is empty", "Cart contains 2 items")
- Any prerequisite steps (e.g. "User must be logged in")

## Test Case Structure

Each test case must include:

| Field | Description |
|---|---|
| Test Case ID | `TC-001` format |
| Type | Positive / Negative / Edge Case |
| Title | Short, descriptive name (e.g. "Successful Login with standard_user") |
| Preconditions | Starting state and user before the test begins |
| Steps | Numbered, atomic, actionable steps |
| Expected Result | Clear, verifiable outcome for each step or the final state |
| Status | Untested / Passed / Failed |

## Coverage Checklist

For each flow, include test cases for:
- ✅ Happy path (positive flow)
- ❌ Negative scenarios (invalid input, missing fields, wrong credentials)
- ⚠️ Edge cases (empty cart, boundary values, navigation between steps)
