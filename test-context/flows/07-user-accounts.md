# 07 — User Accounts

← [Back to Index](../../README.md)

---

## Credentials

All accounts share the same password:

| Field | Value |
|---|---|
| Password | `secret_sauce` |

---

## Available Test Users

| Username | Behavior |
|---|---|
| `standard_user` | Normal user — full access to all features without issues |
| `locked_out_user` | Cannot log in; shows: `Epic sadface: Sorry, this user has been locked out.` |
| `problem_user` | Logs in but has intentional UI bugs (e.g., wrong product images, broken sort, broken links) |
| `performance_glitch_user` | Logs in but experiences intentional delays and slow page responses |
| `error_user` | Logs in but encounters errors on specific interactions (e.g., adding to cart) |
| `visual_user` | Logs in but has intentional visual/layout defects for visual regression testing |

---

## Use Cases for Each User

| Username | Typical Test Scenario |
|---|---|
| `standard_user` | Happy path / positive flow testing |
| `locked_out_user` | Negative login testing |
| `problem_user` | Functional bug detection (wrong images, broken features) |
| `performance_glitch_user` | Performance and timeout testing |
| `error_user` | Error handling and edge case testing |
| `visual_user` | Visual regression / screenshot comparison testing |

---

## Notes

- These users are hardcoded in the demo app and cannot be created, modified, or deleted.
- All usernames are displayed as hints at the bottom of the login page.
