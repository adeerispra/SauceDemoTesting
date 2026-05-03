# 09 — Sorting & Filtering

← [Back to Index](../../README.md)

---

## Overview

The [Product Listing Page](./02-product-listing.md) includes a **sort dropdown** in the top-right area of the product grid. It allows users to reorder the displayed products.

---

## Sort Options

| Sort Option | Value | Description |
|---|---|---|
| Name (A to Z) | `az` | Default; alphabetical ascending order |
| Name (Z to A) | `za` | Alphabetical descending order |
| Price (low to high) | `lohi` | Cheapest products displayed first |
| Price (high to low) | `hilo` | Most expensive products displayed first |

---

## Notes

- The default sort order when first landing on the inventory page is **Name (A to Z)**.
- There is **no category or tag filtering** available — sorting is the only way to reorder products.
- The `problem_user` account has a broken sort feature where sorting does not work correctly (intentional bug for testing purposes).
- See [User Accounts](./07-user-accounts.md) for details on the `problem_user` and other test users.
