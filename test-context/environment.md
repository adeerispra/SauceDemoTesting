# Test Environment

## Overview

SauceDemo has a **single environment** — there is no DEV, Staging, or Production split.  
All testing is done directly on the live demo site.

| Environment | URL | Notes |
|---|---|---|
| Production (only) | `https://www.saucedemo.com/` | The only available environment |

---

## Credentials

All test accounts share the same password. Usernames are displayed as hints on the login page.

| Username | Password | Use Case |
|---|---|---|
| `standard_user` | `secret_sauce` | Happy path / positive flow testing |
| `locked_out_user` | `secret_sauce` | Negative login testing |
| `problem_user` | `secret_sauce` | Functional bug detection |
| `performance_glitch_user` | `secret_sauce` | Performance / timeout testing |
| `error_user` | `secret_sauce` | Error handling testing |
| `visual_user` | `secret_sauce` | Visual regression testing |

---

## Key URL Patterns

| Page | URL |
|---|---|
| Login | `https://www.saucedemo.com/` |
| Product Listing | `https://www.saucedemo.com/inventory.html` |
| Product Detail | `https://www.saucedemo.com/inventory-item.html?id=<product_id>` |
| Cart | `https://www.saucedemo.com/cart.html` |
| Checkout Step 1 (Info) | `https://www.saucedemo.com/checkout-step-one.html` |
| Checkout Step 2 (Overview) | `https://www.saucedemo.com/checkout-step-two.html` |
| Order Confirmation | `https://www.saucedemo.com/checkout-complete.html` |

---

## Checkout Mock Data

The checkout process uses hardcoded mock values — no real payment or shipping is processed.

| Field | Value |
|---|---|
| Payment Info | `SauceCard #31337` |
| Shipping Info | `Free Pony Express Delivery!` |
| Tax | Calculated automatically (fixed rate) |

---

## Test Account Notes

- There are no "real" accounts — all users are pre-configured in the demo app
- Accounts cannot be created, modified, or deleted
- Cart state is maintained in-session and cleared on logout or browser refresh
- No loyalty system, no order history, no saved cards — it's a pure demo

---

## Pre-Test Checklist

Before executing any test:

1. **Login state** — Confirm the correct test user is logged in (or start from the login page)
2. **Cart state** — Ensure the cart is empty before starting. Use **Hamburger (☰) → Reset App State** to clear it
3. **URL** — Verify you are on the correct starting page for the test

---

## Product Availability

All 6 products are always available across all user accounts (except for `problem_user`, who may see wrong images or broken interactions).

| # | Product | Price |
|---|---|---|
| 1 | Sauce Labs Backpack | $29.99 |
| 2 | Sauce Labs Bike Light | $9.99 |
| 3 | Sauce Labs Bolt T-Shirt | $15.99 |
| 4 | Sauce Labs Fleece Jacket | $49.99 |
| 5 | Sauce Labs Onesie | $7.99 |
| 6 | Test.allTheThings() T-Shirt (Red) | $15.99 |
