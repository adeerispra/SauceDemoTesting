# Jira Reporting — Agent Rules

After all test cases for a ticket are complete, follow these two steps in order.

---

## Step 1 — Upload Recordings and Capture Links

The Atlassian MCP does not support file uploads. Use curl to upload each recording and capture its content URL so it can be linked in the comment.

Load credentials from .env at the repo root:

```bash
source .env
AUTH=$(echo -n "$JIRA_EMAIL:$JIRA_API_TOKEN" | base64)
```

If `JIRA_EMAIL` or `JIRA_API_TOKEN` is empty after sourcing `.env`, stop and ask the user to fill in `.env` before proceeding.

Upload each recording and capture the content URL:

```bash
response=$(curl -s -X POST \
  "https://adesembiring61.atlassian.net/rest/api/3/issue/{TICKET_ID}/attachments" \
  -H "Authorization: Basic $AUTH" \
  -H "X-Atlassian-Token: no-check" \
  -F "file=@Testing Result/{TICKET_ID}-[{Test Case Name}]/test-run.webm;filename={TC-ID}-test-run.webm")

content_url=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['content'])")
```

The `content_url` will be in the format: `https://adesembiring61.atlassian.net/rest/api/3/attachment/content/{id}`

Repeat for each test case and save all URLs before moving to Step 2.

---

## Step 2 — Post Comment

Use the Atlassian MCP `addCommentToJiraIssue` after all recordings are uploaded. Include the results table and reference the attached recordings in the comment body:

```
## Test Results

**Ticket:** {TICKET_ID}
**Environment:** https://www.saucedemo.com/

| Test Case | Title | Result | Notes | Recording |
|---|---|---|---|---|
| TC-001 | {Title} | PASS / FAIL | {Observations} | [TC-001-test-run.webm]({content_url_tc001}) |
| TC-002 | {Title} | PASS / FAIL | {Observations} | [TC-002-test-run.webm]({content_url_tc002}) |
```

---

## Rules

- Always do both steps — upload first, then comment — pass or fail — no exceptions
- Upload each test case recording separately (one attachment per test case)
- Post the comment once after **all** test cases and uploads are done
- Do not change the issue status
- Include every test case in the results table, even if skipped or blocked
