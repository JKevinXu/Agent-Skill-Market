import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const child = spawn(process.execPath, ["src/mcp/server.js"], {
  cwd: repoRoot,
  env: { ...process.env, MCP_TRANSPORT: "stdio" },
  stdio: ["pipe", "pipe", "pipe"],
});

let nextId = 1;
const pending = new Map();
let stdoutBuffer = "";
let stderr = "";

child.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

child.stdout.on("data", (chunk) => {
  stdoutBuffer += chunk.toString();
  let newline;
  while ((newline = stdoutBuffer.indexOf("\n")) >= 0) {
    const line = stdoutBuffer.slice(0, newline).trim();
    stdoutBuffer = stdoutBuffer.slice(newline + 1);
    if (!line) continue;
    const message = JSON.parse(line);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  }
});

function request(method, params = {}) {
  const id = nextId++;
  const payload = { jsonrpc: "2.0", id, method, params };
  child.stdin.write(`${JSON.stringify(payload)}\n`);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${method}. stderr=${stderr}`));
    }, 10000);
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
  });
}

function notify(method, params = {}) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
}

try {
  const init = await request("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "agent-skill-market-smoke", version: "0.1.0" },
  });
  if (!init.serverInfo?.name?.includes("agent-skill-market")) {
    throw new Error(`Unexpected serverInfo: ${JSON.stringify(init.serverInfo)}`);
  }
  notify("notifications/initialized");

  const tools = await request("tools/list");
  const names = new Set(tools.tools.map((tool) => tool.name));
  for (const expected of ["skills_list_all", "skills_find_relevant", "skills_get_body", "skills_get_manifest", "skills_get_index"]) {
    if (!names.has(expected)) throw new Error(`Missing tool ${expected}; got ${[...names].join(", ")}`);
  }

  const search = await request("tools/call", {
    name: "skills_find_relevant",
    arguments: { query: "meeting transcript action items", top_k: 3 },
  });
  const searchText = search.content?.[0]?.text ?? "";
  if (!searchText.includes("jkevinxu.meeting-notes-summarizer")) {
    throw new Error(`Search response did not include sample skill: ${searchText}`);
  }

  const index = await request("tools/call", { name: "skills_get_index", arguments: {} });
  const indexText = index.content?.[0]?.text ?? "";
  if (!indexText.includes("sha256:")) throw new Error(`Index missing digest: ${indexText}`);

  console.log("stdio MCP smoke passed");
} finally {
  child.kill("SIGTERM");
  await Promise.race([once(child, "exit"), new Promise((resolve) => setTimeout(resolve, 1000))]);
}
