#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  buildSkillIndex,
  findRelevantSkills,
  getSkillBody,
  getSkillManifest,
} from "./registry.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function jsonContent(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

function textContent(text) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

export function createServer() {
  const server = new McpServer({
    name: "agent-skill-market-mcp",
    version: "0.1.0",
  });

  server.registerTool(
    "skills_get_index",
    {
      title: "Get Skill Index",
      description: "Return the Agent Skill Market skill:// index with digest-pinned installable skill artifacts.",
      inputSchema: {},
    },
    async () => jsonContent(await buildSkillIndex(repoRoot)),
  );

  server.registerTool(
    "skills_list_all",
    {
      title: "List All Skills",
      description: "List all skills currently published by Agent Skill Market.",
      inputSchema: {
        limit: z.number().int().min(1).max(100).optional().default(25),
        offset: z.number().int().min(0).optional().default(0),
      },
    },
    async ({ limit, offset }) => {
      const index = await buildSkillIndex(repoRoot);
      return jsonContent({
        total: index.skills.length,
        skills: index.skills.slice(offset, offset + limit),
      });
    },
  );

  server.registerTool(
    "skills_find_relevant",
    {
      title: "Find Relevant Skills",
      description: "Search Agent Skill Market skills by natural-language task description.",
      inputSchema: {
        query: z.string().min(1),
        top_k: z.number().int().min(1).max(20).optional().default(5),
      },
    },
    async ({ query, top_k }) => jsonContent(await findRelevantSkills(repoRoot, query, top_k)),
  );

  server.registerTool(
    "skills_get_body",
    {
      title: "Get Skill Body",
      description: "Return the SKILL.md content for a specific skill id or name.",
      inputSchema: {
        skill_id: z.string().min(1),
      },
    },
    async ({ skill_id }) => textContent(await getSkillBody(repoRoot, skill_id)),
  );

  server.registerTool(
    "skills_get_manifest",
    {
      title: "Get Skill Manifest",
      description: "Return registry metadata, compatibility, permissions, and install commands for a skill.",
      inputSchema: {
        skill_id: z.string().min(1),
      },
    },
    async ({ skill_id }) => jsonContent(await getSkillManifest(repoRoot, skill_id)),
  );

  return server;
}

async function main() {
  const transport = process.env.MCP_TRANSPORT ?? "stdio";
  if (transport !== "stdio") {
    throw new Error(`Unsupported MCP_TRANSPORT=${transport}; this MVP currently supports stdio only.`);
  }
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
