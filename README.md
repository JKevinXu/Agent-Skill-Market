# Agent Skill Market

Marketplace for portable AI agent skills.

## Website prototype

Open `index.html` locally or use GitHub Pages once enabled for the repository root.

The prototype includes:

- Marketplace landing page
- Sample `Meeting Notes Summarizer` skill
- `Install in Hermes` option
- `Copy Codex install command` option backed by Codex's real plugin marketplace CLI flow
- Downloadable `.skill.zip` bundle
- Registry JSON metadata
- Minimal stdio MCP registry server for installless skill discovery/loading

## Files

- [Website prototype](index.html)
- [Registry JSON](registry/index.json)
- [Sample skill](skills/meeting-notes-summarizer/SKILL.md)
- [Codex plugin manifest](plugins/meeting-notes-summarizer/.codex-plugin/plugin.json)
- [AGENTS.md export](exports/codex/meeting-notes-summarizer/AGENTS.md)
- [Agent Skill Market Design Doc](docs/agent-skill-market-design.md)
- [MCP-vendored skills research/design note](docs/mcp-vendored-skills.md)
- [Research Sources](docs/research-sources.md)

## MCP registry server MVP

Install dependencies and run the stdio MCP server locally:

```bash
npm install
npm run mcp:stdio
```

The server exposes these tools:

- `skills_get_index`
- `skills_list_all`
- `skills_find_relevant`
- `skills_get_body`
- `skills_get_manifest`

Verify the stdio MCP flow:

```bash
npm test
npm run smoke:stdio
```

Example MCP client config:

```json
{
  "mcpServers": {
    "agent-skill-market": {
      "command": "node",
      "args": ["/absolute/path/to/Agent-Skill-Market/src/mcp/server.js"],
      "env": { "MCP_TRANSPORT": "stdio" }
    }
  }
}
```
