import http from "http";
import { spawn } from "child_process";

const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const JIRA_BASE_URL = (
  process.env.JIRA_BASE_URL || "https://adesembiring61.atlassian.net"
).replace(/\/$/, "");

function buildJiraUrl(payload) {
  const key =
    payload?.issue?.key ||
    payload?.issueKey ||
    payload?.data?.issue?.key ||
    null;

  if (!key) return null;
  return `${JIRA_BASE_URL}/browse/${key}`;
}

function runClaude(jiraUrl) {
  console.log(`[claude] spawning: claude --print "Test this ${jiraUrl}"`);

  const proc = spawn("claude", ["--print", `Test this ${jiraUrl}`], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  proc.stdout.on("data", (data) => process.stdout.write(`[claude] ${data}`));
  proc.stderr.on("data", (data) => process.stderr.write(`[claude:err] ${data}`));

  proc.on("close", (code) => {
    console.log(`[claude] exited with code ${code} for ${jiraUrl}`);
  });

  proc.on("error", (err) => {
    console.error(`[claude] failed to start:`, err.message);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
    return;
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    if (WEBHOOK_SECRET) {
      const provided = req.headers["x-webhook-secret"] || "";
      if (provided !== WEBHOOK_SECRET) {
        console.warn("[webhook] rejected: invalid secret");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized");
        return;
      }
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      console.error("[webhook] invalid JSON body");
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request");
      return;
    }

    const event = payload?.webhookEvent || "unknown";
    console.log(`[webhook] received event: ${event}`);

    const jiraUrl = buildJiraUrl(payload);

    if (!jiraUrl) {
      console.warn("[webhook] no issue key found in payload — skipping");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK (no issue key)");
      return;
    }

    console.log(`[webhook] issue URL: ${jiraUrl}`);
    res.writeHead(202, { "Content-Type": "text/plain" });
    res.end("Accepted");

    runClaude(jiraUrl);
  });

  req.on("error", (err) => {
    console.error("[webhook] request error:", err.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  });
});

server.listen(PORT, () => {
  console.log(`[webhook] Jira webhook receiver listening on port ${PORT}`);
  console.log(`[webhook] POST http://localhost:${PORT}/webhook`);
  if (WEBHOOK_SECRET) {
    console.log(`[webhook] secret validation: ENABLED`);
  } else {
    console.log(`[webhook] secret validation: DISABLED (set WEBHOOK_SECRET to enable)`);
  }
});
