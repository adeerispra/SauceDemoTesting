# 06 — Navigation Menu (Hamburger)

← [Back to Index](../../README.md)

---

## Overview

The navigation drawer is opened by clicking the **hamburger icon (☰)** at the top-left corner of any page after login. It slides in from the left side of the screen.

---

## Menu Items

| Menu Item | Action |
|---|---|
| All Items | Navigates to the product listing page (`/inventory.html`) |
| About | Opens the Sauce Labs website (`https://saucelabs.com/`) in the current tab |
| Logout | Logs the user out and redirects to the login page |
| Reset App State | Clears the cart and resets all "Remove" buttons back to "Add to Cart" |
| ✕ Close button | Closes the navigation drawer without performing any action |

---

## Notes

- **Reset App State** is useful during testing to restore the app to its default state without logging out.
- The menu is accessible from all pages after authentication (inventory, product detail, cart, checkout steps).
- **Logout** ends the current session and returns the user to the login page.
