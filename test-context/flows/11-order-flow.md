# 11 — Complete Order Flow

← [Back to Index](../../README.md)

---

## Step-by-Step Order Journey

```
┌─────────────────────────────────────────────┐
│  1. Visit https://www.saucedemo.com/        │
│  2. Enter username: standard_user           │
│  3. Enter password: secret_sauce            │
│  4. Click [Login]                           │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│  PRODUCT LISTING PAGE (/inventory.html)     │
│  5. Browse products                         │
│  6. Optionally apply a sort order           │
│  7. Click [Add to Cart] on desired items    │
│  8. Cart badge updates with item count      │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│  SHOPPING CART (/cart.html)                 │
│  9. Click the cart icon (top-right)         │
│  10. Review items in the cart               │
│  11. Optionally click [Remove] on any item  │
│  12. Click [Checkout]                       │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│  CHECKOUT STEP 1 (/checkout-step-one.html)  │
│  13. Fill in: First Name                    │
│  14. Fill in: Last Name                     │
│  15. Fill in: Postal Code                   │
│  16. Click [Continue]                       │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│  CHECKOUT STEP 2 (/checkout-step-two.html)  │
│  17. Review item list                       │
│  18. Review payment: SauceCard #31337       │
│  19. Review shipping: Free Pony Express     │
│  20. Review subtotal, tax, and total        │
│  21. Click [Finish]                         │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│  ORDER CONFIRMATION (/checkout-complete.html│
│  22. "Thank you for your order!" displayed  │
│  23. Click [Back Home] → returns to listing │
└─────────────────────────────────────────────┘
```

---

## Quick Reference

| Step | Page | Action |
|---|---|---|
| 1 | Login | Enter credentials and log in |
| 2 | Product Listing | Browse and add items to cart |
| 3 | Shopping Cart | Review and confirm cart contents |
| 4 | Checkout — Info | Enter First Name, Last Name, Postal Code |
| 5 | Checkout — Overview | Review order summary and totals |
| 6 | Checkout — Complete | Receive order confirmation |

---

## Related Files

- [Login Page](./01-login.md)
- [Product Listing Page](./02-product-listing.md)
- [Shopping Cart Page](./04-shopping-cart.md)
- [Checkout Flow](./05-checkout-flow.md)
