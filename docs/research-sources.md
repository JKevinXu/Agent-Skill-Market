# Research Sources

Date: 2026-06-07

This file records the sources used for `docs/agent-skill-market-design.md`. Star/fork counts are point-in-time GitHub API snapshots from 2026-06-07.

## Official/product pages fetched

| Source | URL | Tool result summary |
|---|---|---|
| Claude Code Skills docs | https://code.claude.com/docs/en/skills | Title: "Extend Claude with skills - Claude Code Docs". Description: "Create, manage, and share skills to extend Claude's capabilities in Claude Code. Includes custom commands and bundled skills." |
| Official MCP Registry | https://registry.modelcontextprotocol.io/ | Title: "Official MCP Registry". |
| MCP Registry API | https://registry.modelcontextprotocol.io/v0/servers?limit=2 | Returned versioned server JSON entries with schema URL, name, description, remotes, version, and registry metadata. |
| Smithery | https://smithery.ai/ | Title: "Smithery - Connect agents to services in minutes". Description: "Connect agents to thousands of tools and services so they can act with more agency. Auth, credentials, and sessions handled for you." |
| Visual Studio Marketplace | https://marketplace.visualstudio.com/VSCode | Description: "Discover and install extensions and subscriptions to create the dev environment you need." |
| Raycast Store | https://www.raycast.com/store | Description: "A collection of powerful productivity tools all within an extendable launcher." |
| Dify Marketplace | https://marketplace.dify.ai/ | Title/description: "Dify Marketplace". |
| LangSmith Hub | https://smith.langchain.com/hub | Description: "Take agents from prototype to production. LangSmith gives you the tools to build, debug, evaluate, and ship reliable agents." |
| GitHub Marketplace | https://github.com/marketplace | Description: "Find the tools that help your team build better, together." |
| npm local install docs | https://docs.npmjs.com/downloading-and-installing-packages-locally | Description: "Documentation for the npm registry, website, and command-line interface." |
| PyPI pip project | https://pypi.org/project/pip/ | Description: "The PyPA recommended tool for installing Python packages." |

Some OpenAI pages returned HTTP 403 from this environment, so GPT Store details were not used as primary evidence.

## GitHub repository snapshots

| Repo | Stars | Forks | Open issues | Created | Updated | License | Language | Description |
|---|---:|---:|---:|---|---|---|---|---|
| phuryn/pm-skills | 12,203 | 1,460 | n/a | n/a | 2026-06-07 | n/a | n/a | PM Skills Marketplace: 100+ agentic skills, commands, and plugins — from discovery to strategy, execution, launch, and growth. |
| davepoon/buildwithclaude | 3,032 | 374 | n/a | n/a | 2026-06-07 | n/a | n/a | A single hub to find Claude Skills, Agents, Commands, Hooks, Plugins, and Marketplace collections to extend Claude Code, Claude Desktop, Agent SDK and OpenClaw. |
| jeremylongshore/claude-code-plugins-plus-skills | 2,329 | 331 | n/a | n/a | 2026-06-07 | n/a | n/a | 425 plugins, 2,810 skills, 200 agents for Claude Code. Open-source marketplace at tonsofskills.com with the ccpi CLI package manager. |
| daymade/claude-code-skills | 1,156 | 177 | n/a | n/a | 2026-06-07 | n/a | n/a | Professional Claude Code skills marketplace featuring production-ready skills for enhanced development workflows. |
| numman-ali/n-skills | 994 | 100 | n/a | n/a | 2026-06-05 | n/a | n/a | Curated plugin marketplace for AI agents - works with Claude Code, Codex, and openskills. |
| cline/mcp-marketplace | 777 | 115 | n/a | n/a | 2026-05-31 | n/a | n/a | Official repository for submitting MCP servers to Cline's MCP Marketplace. |
| Kilo-Org/kilo-marketplace | 137 | 57 | n/a | n/a | 2026-06-06 | n/a | n/a | Curated collection of Skills, MCP Servers, and Modes for enhancing AI agent capabilities across the Kilo ecosystem. |
| modelcontextprotocol/registry | 6,897 | 847 | 103 | 2025-02-05 | 2026-06-07 | NOASSERTION | Go | A community driven registry service for Model Context Protocol (MCP) servers. |
| modelcontextprotocol/servers | 86,856 | 10,937 | 497 | 2024-11-19 | 2026-06-07 | NOASSERTION | TypeScript | Model Context Protocol Servers. |
| langgenius/dify | 144,247 | 22,705 | 744 | 2023-04-12 | 2026-06-07 | NOASSERTION | TypeScript | Production-ready platform for agentic workflow development. |
| langchain-ai/langchain | 138,717 | 22,987 | 553 | 2022-10-17 | 2026-06-07 | MIT | Python | The agent engineering platform. |
| raycast/extensions | 7,538 | 6,192 | 1,342 | 2021-09-21 | 2026-06-07 | MIT | TypeScript | Everything you need to extend Raycast. |

Note: Several marketplace repos were inspected through the GitHub API and README extraction. For some README-derived rows, only stars/forks/updated/description were needed for the design doc; full issue/license/language fields were not recorded.

## README/install pattern excerpts observed

- `phuryn/pm-skills`: installs by adding a Claude plugin marketplace (`claude plugin marketplace add phuryn/pm-skills`) and installing individual domain plugins (`claude plugin install pm-toolkit@pm-skills`, etc.).
- `davepoon/buildwithclaude`: supports `/plugin marketplace add davepoon/buildwithclaude`, `/plugin search @buildwithclaude`, and `/plugin install <plugin-name>@buildwithclaude`; web UI offers browse/search/filter and copyable commands.
- `jeremylongshore/claude-code-plugins-plus-skills`: supports npm/pnpm CLI (`pnpm add -g @intentsolutionsio/ccpi`, `ccpi search`, `ccpi install`) plus Claude plugin marketplace install commands.
- `daymade/claude-code-skills`: supports Claude plugin marketplace add/install, shell install scripts, and manual installation; highlights a `skill-creator` meta-skill.
- `numman-ali/n-skills`: positions itself as a curated cross-agent marketplace; supports Claude Code native installer and `openskills install`.
- `cline/mcp-marketplace`: emphasizes GitHub issue submissions, review, and one-click install where Cline clones, sets up, and configures an MCP server based on README or optional `llms-install.md`.
- `Kilo-Org/kilo-marketplace`: organizes skills, MCP servers, and modes as related resource types in a repository.
- `modelcontextprotocol/registry`: README describes the registry as providing MCP clients with a list of MCP servers, like an app store for MCP servers, with publish and API docs.
