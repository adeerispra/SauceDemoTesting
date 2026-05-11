---
description: Platform knowledge for SauceDemo (Swag Labs) — environments, credentials, flows, known issues
alwaysApply: true
---

# SauceDemo — Platform Context

Full details live in `test-context/`. This rule is the quick reference.

## Platform Overview

- **Site**: https://www.saucedemo.com/
- **Type**: Demo e-commerce application by Sauce Labs
- **Purpose**: Test automation practice — simulates a real shopping experience
- **Stack**: Static frontend (no real backend transactions)

## Environment

| ENV | URL | Notes |
|---|---|---|
| Production (only) | `https://www.saucedemo.com/` | Single environment; no DEV or Staging |

## Credentials

All test users share the same password:

| Username | Password | Behavior |
|---|---|---|
| `standard_user` | `secret_sauce` | Normal user — use for happy path tests |
| `locked_out_user` | `secret_sauce` | Cannot log in — use for negative login tests |
| `problem_user` | `secret_sauce` | UI bugs (wrong images, broken sort) |
| `performance_glitch_user` | `secret_sauce` | Intentional slow responses |
| `error_user` | `secret_sauce` | Errors on specific interactions |
| `visual_user` | `secret_sauce` | Visual/layout defects |

## Key Pages

| Page | URL |
|---|---|
| Login | `https://www.saucedemo.com/` |
| Product Listing | `https://www.saucedemo.com/inventory.html` |
| Product Detail | `https://www.saucedemo.com/inventory-item.html?id=<id>` |
| Cart | `https://www.saucedemo.com/cart.html` |
| Checkout Step 1 | `https://www.saucedemo.com/checkout-step-one.html` |
| Checkout Step 2 | `https://www.saucedemo.com/checkout-step-two.html` |
| Order Confirmation | `https://www.saucedemo.com/checkout-complete.html` |

## Products (6 Total)

| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

## Order Types

This site supports one order type only: **standard purchase** (add to cart → checkout → confirm).

## Key Known Issues / Limitations

- No real order fulfillment — orders are simulated
- No real payment processing — checkout uses a mock `SauceCard #31337`
- No real shipping — uses mock `Free Pony Express Delivery!`
- Cart is not persisted between sessions (cleared on logout/refresh)
- `problem_user` has intentionally broken sort and wrong product images
- `performance_glitch_user` has a slow login delay

## Pre-Test Checklist

Before executing any test, verify:

1. **Login state** — Confirm the correct test user is logged in
2. **Cart state** — Clear the cart before starting a new test (use Hamburger → Reset App State)
3. **URL** — Confirm you are on the correct page before running steps

## Important Test Rules

- Always use `standard_user` for happy path / positive flow tests
- Use `locked_out_user` only for negative login scenario tests
- Cart badge counter updates in real-time as items are added/removed
- The **Reset App State** menu option clears the cart without logging out
- Checkout form requires: First Name, Last Name, Postal Code — all mandatory
- Payment info on checkout overview is always `SauceCard #31337` (hardcoded)
- Shipping info is always `Free Pony Express Delivery!` (hardcoded)
- After clicking **Finish**, cart is emptied automatically

## Deep Reference

See `test-context/` for full flow details:
- `flows/01-login.md` — Login, error messages, users
- `flows/02-product-listing.md` — Products grid, sort
- `flows/03-product-detail.md` — Product detail page
- `flows/04-shopping-cart.md` — Cart management
- `flows/05-checkout-flow.md` — Full 3-step checkout
- `flows/06-navigation-menu.md` — Hamburger menu
- `flows/07-user-accounts.md` — All test users
- `flows/08-products-catalog.md` — All products and prices
- `flows/09-sorting-filtering.md` — Sort options
- `flows/10-feature-summary.md` — Feature list
- `flows/11-order-flow.md` — Complete order journey
- `environment.md` — Credentials and URLs
- `known-issues.md` — Limitations and observations
