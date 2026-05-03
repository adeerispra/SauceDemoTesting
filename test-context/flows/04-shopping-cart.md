# 04 — Shopping Cart Page

**URL:** `https://www.saucedemo.com/cart.html`

← [Back to Index](../../README.md)

---

## UI Elements

| Element | Description |
|---|---|
| Page title | "Your Cart" |
| Item list | Each item shows: Quantity, Name, Description, Price |
| Remove button | Removes the individual item from the cart |
| Continue Shopping button | Returns to the product listing page |
| Checkout button | Proceeds to the checkout flow |
| Hamburger menu icon (☰) | Top-left; opens the side navigation drawer |
| Cart icon | Top-right, with badge showing cart item count |

---

## Behaviors

- Items can be removed individually using the **Remove** button next to each item.
- Clicking **Continue Shopping** navigates back to the product listing without clearing the cart.
- Clicking **Checkout** moves to [Checkout Step 1 — Your Information](./05-checkout-flow.md).
- The cart badge count updates in real time as items are added or removed.

---

## Notes

- There is no quantity editing on the cart page — each item is listed with a fixed quantity of 1.
- Items persist in the cart across page navigation until removed or the app state is reset.
- See [Navigation Menu](./06-navigation-menu.md) for the **Reset App State** option that clears the cart.
