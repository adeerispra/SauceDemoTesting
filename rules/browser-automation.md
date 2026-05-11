# Browser Automation — Agent Rules

This repository uses `agent-browser` ([vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)) for all browser automation.

---

## Bootstrap (one-time per machine)

```bash
npm install -g agent-browser
agent-browser install
agent-browser --version
```

---

## Startup Order (Mandatory)

Always run commands in this exact order. Do not deviate.

1. Kill any stale session: `agent-browser close --all` (ignore errors if nothing is running)
2. Create the result folder: `Testing Result/{TICKET_ID}-{Test_Case_Name}/`
3. `open https://www.saucedemo.com/ --headed` — starts a fresh daemon and launches **one** browser window.
4. `record start "Testing Result/{TICKET_ID}-{Test_Case_Name}/test-run.webm"` — records the existing session. **Do NOT pass a URL here** — passing a URL opens a second browser window.
5. All other commands (`click`, `type`, `wait`, etc.) — run after `record start`.

**Never pass a URL to `record start`.** Use `record start <path>` only — no URL argument. Passing a URL to `record start` creates a second browser context, resulting in two browser windows open at once.

**Never take screenshots (`snapshot`) during test execution.** Video recording is the only evidence artifact — do not capture any `.png` or image files at any point.

---

## Session Close (Mandatory)

At the end of every test — pass or fail — run these two commands in order:

```bash
agent-browser record stop
agent-browser --session {SESSION_NAME} close
```

`record stop` saves the `.webm` file to the path given in `record start`. **It must run before `close`** — closing the session first will discard the recording.

This clears all browser state (localStorage, cookies, session) so the next test starts clean. Always close before starting a new test case.

---

## Recording Output

Each test case produces one recording. After the session is closed, save the recording to:

```
Testing Result/
└── {TICKET_ID}-[{Test Case Name}]/
    └── test-run.webm
```

**Rules:**
- One folder and one recording per test case — never mix recordings from different test cases
- Each test case has its own `close --all` → `open --headed` → `record start <path>` → test steps → `record stop` → `close` cycle
- Always kill stale sessions before `open`

---

## SauceDemo-Specific Notes

- Always start from the login page: `https://www.saucedemo.com/`
- Use `standard_user` / `secret_sauce` for happy path tests
- Clear cart state between tests using **Hamburger → Reset App State** (do NOT manually delete localStorage unless necessary)
- The site has no real backend — all interactions are client-side only
- No network calls need to be waited on; navigation between pages is instant
