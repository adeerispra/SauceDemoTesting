# SauceDemo (Swag Labs) — QA Test Suite

QA test context, flow documentation, and agent rules for the **SauceDemo** demo e-commerce application.

> **Site URL:** https://www.saucedemo.com/  
> **Purpose:** Demo e-commerce app by Sauce Labs for practicing test automation.

---

## Repository Structure

```
.
├── AGENTS.md                          # AI agent instructions and runtime policy
├── rules/
│   ├── saucedemo-context.mdc          # Platform overview, credentials, known issues (quick ref)
│   ├── test-case-generation.mdc       # Workflow and format for generating test cases
│   └── browser-automation.md         # Browser session, recording, and startup rules
├── test-context/
│   ├── environment.md                 # Environments, credentials, URLs, product list
│   ├── known-issues.md                # Known bugs, limitations, and observations
│   └── flows/                         # Step-by-step flow documentation (01–11)
│       ├── 01-login.md
│       ├── 02-product-listing.md
│       ├── 03-product-detail.md
│       ├── 04-shopping-cart.md
│       ├── 05-checkout-flow.md
│       ├── 06-navigation-menu.md
│       ├── 07-user-accounts.md
│       ├── 08-products-catalog.md
│       ├── 09-sorting-filtering.md
│       ├── 10-feature-summary.md
│       └── 11-order-flow.md
├── tc_template/                       # Generated Excel test case files per feature/ticket
└── Testing Result/                    # Test recordings (.webm), one folder per test case
```

---

## Quick Reference

| Item | Value |
|---|---|
| Site URL | `https://www.saucedemo.com/` |
| Standard user | `standard_user` / `secret_sauce` |
| Locked user | `locked_out_user` / `secret_sauce` |
| Products | 6 items ($7.99 – $49.99) |
| Checkout mock card | `SauceCard #31337` |

---

## Flow Files

| # | File | Description |
|---|---|---|
| 01 | [Login](./test-context/flows/01-login.md) | Login UI, credentials, error messages |
| 02 | [Product Listing](./test-context/flows/02-product-listing.md) | Products grid, card elements, sort |
| 03 | [Product Detail](./test-context/flows/03-product-detail.md) | Individual product view |
| 04 | [Shopping Cart](./test-context/flows/04-shopping-cart.md) | Cart management |
| 05 | [Checkout Flow](./test-context/flows/05-checkout-flow.md) | 3-step checkout: info → overview → confirmation |
| 06 | [Navigation Menu](./test-context/flows/06-navigation-menu.md) | Hamburger sidebar menu |
| 07 | [User Accounts](./test-context/flows/07-user-accounts.md) | All 6 test users and behaviors |
| 08 | [Products Catalog](./test-context/flows/08-products-catalog.md) | All 6 products with prices |
| 09 | [Sorting & Filtering](./test-context/flows/09-sorting-filtering.md) | Sort options |
| 10 | [Feature Summary](./test-context/flows/10-feature-summary.md) | Full feature list at a glance |
| 11 | [Order Flow](./test-context/flows/11-order-flow.md) | Complete step-by-step order journey |

---

## Getting Started

Read `AGENTS.md` first — it contains the full runtime policy and rules for test execution.
