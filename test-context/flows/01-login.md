# 01 — Login Page

**URL:** `https://www.saucedemo.com/`

← [Back to Index](../../README.md)

---

## UI Elements

| Element | Description |
|---|---|
| Username field | Text input (`id="user-name"`) |
| Password field | Password input (`id="password"`) |
| Login button | Submits credentials (`id="login-button"`) |
| Accepted usernames hint | Displayed at the bottom listing all valid usernames |
| Password hint | Shows the shared password (`secret_sauce`) |
| Error message banner | Appears on invalid login attempts |

---

## Error Messages

| Scenario | Error Message |
|---|---|
| Empty username/password | `Epic sadface: Username is required` |
| Wrong credentials | `Epic sadface: Username and password do not match any user in this service` |
| Locked out user | `Epic sadface: Sorry, this user has been locked out.` |

---

## Notes

- On successful login, the user is redirected to the **Products** page (`/inventory.html`).
- The login page displays accepted usernames and the shared password as hints at the bottom of the form, intended for demo/test purposes.
- See [User Accounts](./07-user-accounts.md) for the full list of test users and their behaviors.
