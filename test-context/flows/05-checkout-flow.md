# 05 — Checkout Flow

← [Back to Index](../../README.md)

The checkout process consists of **3 steps**: Your Information → Order Overview → Order Confirmation.

---

## Step 1 — Your Information

**URL:** `https://www.saucedemo.com/checkout-step-one.html`

### UI Elements

| Element | Description |
|---|---|
| Page title | "Checkout: Your Information" |
| First Name field | Text input (`id="first-name"`) |
| Last Name field | Text input (`id="last-name"`) |
| Postal Code field | Text input (`id="postal-code"`) |
| Cancel button | Returns to the cart page |
| Continue button | Validates form and proceeds to Step 2 |
| Error message banner | Appears when required fields are left empty |

### Form Validation Error Messages

| Scenario | Error Message |
|---|---|
| Empty First Name | `Error: First Name is required` |
| Empty Last Name | `Error: Last Name is required` |
| Empty Postal Code | `Error: Postal Code is required` |

---

## Step 2 — Order Overview

**URL:** `https://www.saucedemo.com/checkout-step-two.html`

### UI Elements

| Element | Description |
|---|---|
| Page title | "Checkout: Overview" |
| Item list | All cart items with name, description, and price |
| Payment Information | Displays: `SauceCard #31337` |
| Shipping Information | Displays: `Free Pony Express Delivery!` |
| Item total | Sum of all product prices (before tax) |
| Tax | Calculated tax on the subtotal |
| Total | Item total + tax (final amount) |
| Cancel button | Returns to the product listing page |
| Finish button | Completes and places the order |

---

## Step 3 — Order Confirmation

**URL:** `https://www.saucedemo.com/checkout-complete.html`

### UI Elements

| Element | Description |
|---|---|
| Page title | "Checkout: Complete!" |
| Success icon | Checkmark / pony express image |
| Header message | `"Thank you for your order!"` |
| Sub-message | `"Your order has been dispatched, and will arrive just as fast as the pony can get there!"` |
| Back Home button | Returns to the product listing page and resets the cart |

---

## Notes

- The **Cancel** button on Step 2 goes back to the product listing, not the cart.
- After clicking **Back Home** on the confirmation page, the cart is emptied automatically.
- See [Order Flow](./11-order-flow.md) for the full step-by-step journey.
