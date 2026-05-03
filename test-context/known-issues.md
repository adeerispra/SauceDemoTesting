# Known Issues & Limitations

This document lists confirmed observations, limitations, and intentional behaviors in the SauceDemo application.

> **Note:** SauceDemo is a static demo app — some "issues" are intentional features designed to support different types of test automation practice.

---

## Severity Levels

| Level | Meaning |
|---|---|
| 🔴 HIGH | Blocks core functionality or a test flow |
| 🟡 MEDIUM | Degrades functionality; workaround available |
| 🟢 LOW | Minor / cosmetic; does not block flows |
| ℹ️ LIMITATION | Expected constraint of the demo environment |

---

## 🔴 HIGH — Intentional Bugs (by User Type)

### BUG-001: `problem_user` — Wrong Product Images
**Affected flow:** Product Listing, Product Detail  
**Symptom:** All product images display incorrectly (all show the same image or wrong images) for `problem_user`.  
**Impact:** Cannot visually verify product images when logged in as `problem_user`.  
**Workaround:** Use `standard_user` for image verification tests. Use `problem_user` only when testing image bug detection.

### BUG-002: `problem_user` — Sort Does Not Work
**Affected flow:** Product Listing — Sort dropdown  
**Symptom:** Selecting a sort option does not reorder the product list correctly for `problem_user`.  
**Impact:** Cannot verify sort functionality when logged in as `problem_user`.  
**Workaround:** Use `standard_user` for sort validation tests.

### BUG-003: `performance_glitch_user` — Slow Login Response
**Affected flow:** Login  
**Symptom:** Login takes several seconds (intentional delay) for `performance_glitch_user`.  
**Impact:** Tests with short timeouts may fail if not accounting for the delay.  
**Workaround:** Increase wait times or timeouts when testing with `performance_glitch_user`.

---

## 🟢 LOW — Cosmetic / Minor

### BUG-004: `visual_user` — Layout Defects
**Affected flow:** All pages  
**Symptom:** `visual_user` experiences intentional visual/layout differences across the site.  
**Impact:** Visual tests (screenshot comparisons) will fail.  
**Workaround:** Use `standard_user` for functional tests. Use `visual_user` only for visual regression testing scenarios.

---

## ℹ️ Limitations

### LIMIT-001: Single Environment — No DEV or Staging
- The site `https://www.saucedemo.com/` is the only available environment.
- There is no separate DEV, Staging, or Production split.
- All testing is done on the live demo site.

### LIMIT-002: No Real Order Fulfillment
- Orders placed on SauceDemo are **not real** — no payment is processed, no item is shipped.
- Checkout uses a mock `SauceCard #31337` with a hardcoded payment info display.
- Shipping info is always `Free Pony Express Delivery!`.

### LIMIT-003: Cart Is Not Persisted Across Sessions
- Cart contents are stored in-session only.
- Refreshing the page or logging out clears the cart.
- Use **Hamburger → Reset App State** to programmatically clear the cart without logging out.

### LIMIT-004: No Order History
- There is no order history or account profile page.
- Once the order confirmation is navigated away from, the order details are not recoverable.
- **Action:** Capture the Order Confirmation screen (`/checkout-complete.html`) during testing — it is the only confirmation state.

### LIMIT-005: No Quantity Editing on Cart Page
- Items in the cart are listed with a fixed quantity of 1.
- There is no quantity `+`/`−` control on the cart page.
- To add more of the same item, return to the product listing and add it again (each add is treated independently).

### LIMIT-006: Checkout Form Accepts Any Values
- The checkout form (First Name, Last Name, Postal Code) does not validate the content of the fields.
- It only validates that the fields are **not empty**.
- Any string (including test data like "aaa", "123") is accepted.

### LIMIT-007: `locked_out_user` Cannot Log In
- `locked_out_user` is permanently blocked from logging in.
- This is intentional — use only for negative login test scenarios.

### LIMIT-008: No Product Stock Limits
- All products are always available in unlimited quantities.
- There is no sold-out state or stock validation.

---

## How to Report New Observations

When noting a new issue or unexpected behavior:

```
- Username used:
- Page / URL:
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
- Screenshot or recording (if available):
```
