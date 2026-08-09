import http from "http";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const JIRA_BASE_URL = (process.env.JIRA_BASE_URL || "").replace(/\/$/, "");
const TARGET_JIRA_STATUS = process.env.TARGET_JIRA_STATUS || "Ready for Testing";
const CLAUDE_SKIP_PERMISSIONS = process.env.CLAUDE_SKIP_PERMISSIONS === "true";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function timestamp() {
  return new Date().toISOString();
}

function log(tag, msg) {
  console.log(`[${timestamp()}] [${tag}] ${msg}`);
}

function logErr(tag, msg) {
  console.error(`[${timestamp()}] [${tag}] ${msg}`);
}

function buildJiraUrl(payload) {
  const key =
    payload?.issue?.key ||
    payload?.issueKey ||
    payload?.data?.issue?.key ||
    null;

  if (!key) return null;
  return `${JIRA_BASE_URL}/browse/${key}`;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function getIssueKey(payload) {
  return (
    payload?.issue?.key ||
    payload?.issueKey ||
    payload?.data?.issue?.key ||
    "UNKNOWN"
  );
}

function getCurrentStatus(payload) {
  return (
    payload?.issue?.fields?.status?.name ||
    payload?.issue?.status?.name ||
    payload?.status?.name ||
    payload?.toStatus ||
    payload?.data?.issue?.fields?.status?.name ||
    null
  );
}

function hasTargetStatusTransition(payload) {
  const target = normalize(TARGET_JIRA_STATUS);
  const changelogItems = payload?.changelog?.items || payload?.data?.changelog?.items || [];

  const transitionedToTarget = changelogItems.some((item) => {
    return normalize(item?.field) === "status" && normalize(item?.toString) === target;
  });

  if (transitionedToTarget) return true;

  return normalize(getCurrentStatus(payload)) === target;
}

function parseAgentLine(line) {
  const lower = line.toLowerCase();

  if (lower.includes("generating test case") || lower.includes("create test case") || lower.includes("writing test case")) {
    return { tag: "test-gen", msg: line.trim() };
  }
  if (lower.includes("excel") || lower.includes(".xlsx") || lower.includes("tc_template")) {
    return { tag: "test-gen", msg: `Creating Excel test case file — ${line.trim()}` };
  }
  if (lower.includes("executing") && lower.includes("tc-")) {
    return { tag: "test-run", msg: line.trim() };
  }
  if (lower.match(/running test case|executing test|starting test/)) {
    return { tag: "test-run", msg: line.trim() };
  }
  if (lower.match(/tc-\d+/) && lower.includes("pass")) {
    return { tag: "test-pass", msg: `PASS — ${line.trim()}` };
  }
  if (lower.match(/tc-\d+/) && lower.includes("fail")) {
    return { tag: "test-fail", msg: `FAIL — ${line.trim()}` };
  }
  if (lower.includes("open") && lower.includes("saucedemo")) {
    return { tag: "browser", msg: `Opening browser — ${line.trim()}` };
  }
  if (lower.includes("record start")) {
    return { tag: "browser", msg: "Starting screen recording" };
  }
  if (lower.includes("record stop") || lower.includes("session close")) {
    return { tag: "browser", msg: "Stopping recording and closing browser session" };
  }
  if (lower.includes("login") || lower.includes("standard_user")) {
    return { tag: "step", msg: `Logging in — ${line.trim()}` };
  }
  if (lower.includes("add to cart") || lower.includes("shopping cart")) {
    return { tag: "step", msg: `Cart action — ${line.trim()}` };
  }
  if (lower.includes("checkout")) {
    return { tag: "step", msg: `Checkout step — ${line.trim()}` };
  }
  if (lower.includes("sort") || lower.includes("filter")) {
    return { tag: "step", msg: `Sort/Filter — ${line.trim()}` };
  }
  if (lower.includes("reading") || lower.includes("read file")) {
    return { tag: "context", msg: `Reading context — ${line.trim()}` };
  }
  if (lower.includes("saving") || lower.includes("writing result") || lower.includes("testing result")) {
    return { tag: "result", msg: `Saving result — ${line.trim()}` };
  }
  if (lower.includes("done") || lower.includes("complete") || lower.includes("finished")) {
    return { tag: "done", msg: line.trim() };
  }

  return null;
}

function logToolUse(name, input) {
  if (name === "Read") {
    log("context", `Reading file — ${input.file_path ?? ""}`);
  } else if (name === "Write" || name === "Edit") {
    log("test-gen", `Writing file — ${input.file_path ?? ""}`);
  } else if (name === "Bash" || name === "PowerShell") {
    const cmd = (input.command ?? "").trim();
    if (cmd.includes("record start")) {
      log("browser", `record start — ${cmd}`);
    } else if (cmd.includes("record stop")) {
      log("browser", `record stop — saving .webm`);
    } else if (cmd.includes("agent-browser") && cmd.includes("open")) {
      log("browser", `open browser — ${cmd}`);
    } else if (cmd.includes("agent-browser") && cmd.includes("close")) {
      log("browser", `close session — ${cmd}`);
    } else if (cmd.includes("agent-browser")) {
      log("step", `agent-browser — ${cmd}`);
    } else if (cmd.includes("mkdir")) {
      log("step", `mkdir — ${cmd}`);
    } else if (cmd.includes("curl")) {
      log("jira", `curl upload — ${cmd.slice(0, 80)}...`);
    } else {
      log("step", `cmd — ${cmd.slice(0, 120)}`);
    }
  } else if (name.includes("Jira") || name.includes("jira") || name.includes("addComment")) {
    log("jira", `Jira tool — ${name}`);
  }
}

function runClaude(jiraUrl, issueKey) {
  log("agent", `Starting QA agent for ${issueKey}`);
  log("agent", `Jira URL: ${jiraUrl}`);
  log("agent", "Step 1 — Reading test context and flow documentation...");

  const prompt = `A new Jira ticket has been assigned for QA testing: ${jiraUrl}. Follow the full test execution workflow defined in CLAUDE.md. Start immediately.`;

  const extraPaths = [
    process.env.USERPROFILE,
    process.env.APPDATA ? `${process.env.APPDATA}\\npm` : null,
    process.env.LOCALAPPDATA
      ? `${process.env.LOCALAPPDATA}\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1-full_build\\bin`
      : null,
  ].filter(Boolean);
  const claudeArgs = ["--print", "--output-format", "stream-json", "--verbose"];

  if (CLAUDE_SKIP_PERMISSIONS) {
    claudeArgs.splice(1, 0, "--dangerously-skip-permissions");
  }

  const proc = spawn(
    "claude",
    claudeArgs,
    {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      cwd: __dirname,
      env: {
        ...process.env,
        PATH: [...extraPaths, process.env.PATH].filter(Boolean).join(path.delimiter),
      },
    }
  );

  proc.stdin.write(prompt);
  proc.stdin.end();

  let buffer = "";

  proc.stdout.on("data", (data) => {
    buffer += data.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;

      let event;
      try {
        event = JSON.parse(line);
      } catch {
        log("agent", line.trim());
        continue;
      }

      if (event.type === "assistant") {
        const content = event.message?.content ?? [];
        for (const block of content) {
          if (block.type === "text" && block.text?.trim()) {
            const parsed = parseAgentLine(block.text.trim());
            if (parsed) {
              log(parsed.tag, parsed.msg);
            } else {
              log("agent", block.text.trim());
            }
          }
          if (block.type === "tool_use") {
            logToolUse(block.name, block.input ?? {});
          }
        }
      }

      if (event.type === "tool_use") {
        const name = event.tool_name ?? event.tool_use?.name ?? event.name ?? "unknown";
        const input = event.tool_input ?? event.tool_use?.input ?? event.input ?? {};
        logToolUse(name, input);
      }

      if (event.type === "result") {
        const cost = event.cost_usd ? ` | cost: $${event.cost_usd.toFixed(4)}` : "";
        const duration = event.duration_ms ? ` | duration: ${(event.duration_ms / 1000).toFixed(1)}s` : "";
        log("done", `Session complete${duration}${cost}`);
      }
    }
  });

  proc.stderr.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) logErr("agent:err", line.trim());
    }
  });

  proc.on("close", (code) => {
    if (code === 0) {
      log("done", `QA agent finished successfully for ${issueKey}`);
    } else {
      logErr("done", `QA agent exited with code ${code} for ${issueKey}`);
    }
  });

  proc.on("error", (err) => {
    logErr("agent", `Failed to start claude process: ${err.message}`);
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
        logErr("webhook", "Rejected request — invalid secret");
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized");
        return;
      }
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      logErr("webhook", "Invalid JSON body — request rejected");
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request");
      return;
    }

    const event = payload?.webhookEvent || "unknown";
    log("webhook", `Received Jira event: ${event}`);

    if (!JIRA_BASE_URL) {
      logErr("webhook", "Missing JIRA_BASE_URL — request rejected");
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server configuration missing JIRA_BASE_URL");
      return;
    }

    if (!hasTargetStatusTransition(payload)) {
      const currentStatus = getCurrentStatus(payload) || "unknown";
      log("webhook", `Issue status is '${currentStatus}' — waiting for '${TARGET_JIRA_STATUS}'`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`OK (ignored: target status is ${TARGET_JIRA_STATUS})`);
      return;
    }

    const jiraUrl = buildJiraUrl(payload);
    const issueKey = getIssueKey(payload);

    if (!jiraUrl) {
      log("webhook", "No issue key found in payload — skipping");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK (no issue key)");
      return;
    }

    log("webhook", `Issue key: ${issueKey}`);
    log("webhook", `Issue URL: ${jiraUrl}`);
    log("webhook", "Accepted — handing off to QA agent...");

    res.writeHead(202, { "Content-Type": "text/plain" });
    res.end("Accepted");

    runClaude(jiraUrl, issueKey);
  });

  req.on("error", (err) => {
    logErr("webhook", `Request error: ${err.message}`);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  });
});

server.on("error", (err) => {
  logErr("server", `Failed to start webhook receiver: ${err.message}`);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  log("server", `Jira webhook receiver listening on ${HOST}:${PORT}`);
  log("server", `Endpoint: POST http://${HOST}:${PORT}/webhook`);
  log("server", `Jira base URL: ${JIRA_BASE_URL || "(not configured)"}`);
  log("server", `Target Jira status: ${TARGET_JIRA_STATUS}`);
  log("server", `Claude skip permissions: ${CLAUDE_SKIP_PERMISSIONS ? "ENABLED" : "DISABLED"}`);
  if (WEBHOOK_SECRET) {
    log("server", "Secret validation: ENABLED");
  } else {
    log("server", "Secret validation: DISABLED (set WEBHOOK_SECRET to enable)");
  }
});
