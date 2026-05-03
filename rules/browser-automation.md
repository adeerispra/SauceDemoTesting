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

1. `open <url>` — starts the daemon and launches the browser. Nothing else works until this succeeds.
2. `record start` — run only after `open` has returned successfully.
3. All other commands (`click`, `type`, `wait`, etc.) — run after `record start`.

**Never run `record start` or any other command before `open`.** The daemon does not exist yet and the command will hang indefinitely.

**Never take screenshots (`snapshot`) during test execution.** Video recording is the only evidence artifact — do not capture any `.png` or image files at any point.

---

## Session Close (Mandatory)

Close the session at the end of every test — pass or fail — no exceptions:

```bash
agent-browser --session {SESSION_NAME} close
```

This stops the recording and clears all browser state (localStorage, cookies, session) so the next test starts clean. Always close before starting a new test case.

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
- Each test case has its own `open` → `record start` → `close` cycle
- Always create the result folder before starting the test

---

## SauceDemo-Specific Notes

- Always start from the login page: `https://www.saucedemo.com/`
- Use `standard_user` / `secret_sauce` for happy path tests
- Clear cart state between tests using **Hamburger → Reset App State** (do NOT manually delete localStorage unless necessary)
- The site has no real backend — all interactions are client-side only
- No network calls need to be waited on; navigation between pages is instant
