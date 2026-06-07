# Agent Skill Market Design Doc

Status: Draft v0.1
Date: 2026-06-07
Repo: JKevinXu/Agent-Skill-Market

## 1. Executive summary

Agent Skill Market is a discovery, trust, and installation layer for reusable AI-agent skills. A skill is a packaged bundle of instructions, workflows, prompts, scripts, examples, and optional tool/MCP dependencies that an agent can load on demand.

The market should not start as a heavyweight paid app store. The strongest pattern in existing ecosystems is:

1. Git-native packages as the source of truth.
2. A searchable registry/index for discovery.
3. One-command install through the host agent CLI.
4. Human-readable manifests and README/SKILL.md files.
5. Curation, validation, and trust metadata before monetization.

Recommendation: build an MVP around a public registry plus CLI installer:

- `agent-skill search <query>`: search skills by name, tags, agent compatibility, tools, and install count.
- `agent-skill show <id>`: view README, manifest, permissions, dependencies, publisher, and verification status.
- `agent-skill install <id>`: install into the user agent's skill directory, with explicit confirmation for scripts/tools/network permissions.
- `agent-skill publish`: validate and submit a GitHub-hosted skill package to the registry.
- Web UI: browse, search, copy install command, inspect trust metadata.

## 2. Problem statement

Agent ecosystems are accumulating useful skills, commands, MCP servers, templates, hooks, and agent modes, but they are fragmented across GitHub repositories, docs pages, and chat threads. Users need a safe way to answer:

- What skill already exists for this task?
- Is it compatible with my agent, OS, and enabled tools?
- What will it install or execute?
- Is it maintained, trusted, and reviewed?
- How do I install it without manually copying folders into hidden directories?
- How do publishers update skills without breaking users?

## 3. Research snapshot: existing products and patterns

Research was performed on 2026-06-07 using official pages and GitHub API/search results. Star counts are a directional popularity snapshot, not quality guarantees.

### 3.1 Directly adjacent AI skill/plugin marketplaces

| Product / repo | What it is | Discovery model | Install model | Notable pattern | Snapshot |
|---|---|---|---|---|---|
| PM Skills Marketplace (`phuryn/pm-skills`) | Domain-specific marketplace for product-management skills, commands, and Claude plugins. | GitHub README plus categorized plugins. | Claude plugin marketplace add/install commands. | Packages multiple skills/commands into installable domain plugins. | 12,203 stars, 1,460 forks. |
| Build with Claude (`davepoon/buildwithclaude`) | Hub for Claude Skills, Agents, Commands, Hooks, Plugins, Marketplaces, and MCP servers. | Web UI with filtering/search plus GitHub repo. | `/plugin marketplace add`, `/plugin search`, `/plugin install`. | Web discovery surface that mainly copies/teaches CLI install commands. | 3,032 stars, 374 forks. |
| Tons of Skills / ccpi (`jeremylongshore/claude-code-plugins-plus-skills`) | Large Claude Code plugin/skill/agent catalog with an npm CLI package manager. | Web marketplace plus generated catalog JSON in repo. | `pnpm add -g @intentsolutionsio/ccpi`, `ccpi search`, `ccpi install`, or Claude plugin commands. | Generated marketplace metadata, category index, CLI installer, install counts. | 2,329 stars, 331 forks. |
| Claude Code Skills Marketplace (`daymade/claude-code-skills`) | Curated marketplace with production-ready Claude Code skills. | GitHub README catalog. | Claude plugin marketplace, shell install scripts, manual install. | Emphasizes a `skill-creator` meta-skill and automated validation. | 1,156 stars, 177 forks. |
| n-skills (`numman-ali/n-skills`) | Curated cross-agent skill marketplace for Claude Code, Codex, and openskills. | GitHub catalog and categories. | Agent-native install or universal `openskills` installer. | Cross-agent compatibility is a central positioning point. | 994 stars, 100 forks. |
| Kilo Marketplace (`Kilo-Org/kilo-marketplace`) | Curated skills, MCP servers, and modes for Kilo Code/CLI and compatible agents. | GitHub directory structure. | PR-based contribution and host-agent consumption. | Treats skills, MCP servers, and modes as related but distinct package types. | 137 stars, 57 forks. |

### 3.2 Adjacent AI tool registries

| Product / repo | What it is | Discovery model | Install model | Notable pattern | Snapshot |
|---|---|---|---|---|---|
| Official MCP Registry (`modelcontextprotocol/registry`) | Registry service for MCP servers, described as an app store for MCP servers. | API and registry website. | Clients read registry entries; servers publish via CLI/API. | Strong typed server schema, versioned API, official/community status metadata. | 6,897 stars, 847 forks. |
| Cline MCP Marketplace (`cline/mcp-marketplace`) | Curated MCP server submissions for one-click install in Cline. | GitHub issue submissions and in-app marketplace. | One-click install where Cline clones, sets up, and configures from README/`llms-install.md`. | Submission review checklist and optional LLM-readable install guide. | 777 stars, 115 forks. |
| Smithery | MCP/tool discovery and hosted connection platform. | Web catalog. | Hosted auth, credentials, sessions, and agent connections. | Moves beyond install into credential/session management. | Official page describes connecting agents to services with auth handled. |
| Dify Marketplace | Plugin marketplace for Dify ecosystem. | Web marketplace. | Host-platform plugin install. | Marketplace is tied to a full agent/workflow platform. | `langgenius/dify`: 144,247 stars, 22,705 forks. |
| LangSmith Hub | Hub for prompts/agent assets in LangChain ecosystem. | Web hub. | Pull/use assets through LangChain/LangSmith workflows. | Assets are versioned and integrated with evaluation/production observability. | `langchain-ai/langchain`: 138,717 stars, 22,987 forks. |

### 3.3 Cross-agent skill marketplace landscape

There are emerging cross-agent skill-market efforts, but no clearly dominant, neutral, trusted marketplace across all major agent clients yet. The best current pattern is a split between:

- a cross-agent installer/loader that adapts `SKILL.md` into each client (`openskills`), and
- one or more curated catalogs that can be installed through that loader (`n-skills`, Context Engineering Kit, Kilo Marketplace, and smaller registries).

| Product / repo | Cross-agent claim | Supported clients mentioned | Install/discovery pattern | Implication for Agent Skill Market |
|---|---|---|---|---|
| OpenSkills (`numman-ali/openskills`) | Universal skills loader for AI coding agents; same format as Claude Code. | Claude Code, Cursor, Windsurf, Aider, Codex, and anything that reads `AGENTS.md`. | `npx openskills install <source>`, `npx openskills sync`, `npx openskills read <skill-name>`. | Treat as the strongest installer precedent; Agent Skill Market should interoperate with or emulate its AGENTS.md bridge. |
| n-skills (`numman-ali/n-skills`) | "One marketplace. Every agent." | Claude Code, Codex, Cursor, Windsurf, Cline, OpenCode, Amp Code, AGENTS.md-compatible tools. | Native Claude plugin commands, Codex `$skill-installer`, and OpenSkills universal install. | Strongest direct curated cross-agent marketplace precedent. Its weakness is still GitHub/README-centric trust and metadata. |
| Kilo Marketplace (`Kilo-Org/kilo-marketplace`) | Skills follow an open Agent Skills specification and are interoperable across compatible agents. | Kilo Code/CLI and compatible agents. | GitHub catalog with skills, MCP servers, and modes. | Reinforces that skills, MCPs, and modes should be discoverable together but installed as distinct package types. |
| Context Engineering Kit (`NeoLabHQ/context-engineering-kit`) | Claude Code marketplace with alternative install paths for Cursor, Antigravity, Codex, OpenCode, and others. | Claude Code, OpenCode, Cursor, Antigravity, Gemini CLI, others. | Claude `/plugin marketplace add` plus OpenSkills install for non-Claude setups. | Shows a practical transitional model: native Claude plugin UX plus universal fallback. |
| Agent Skills CLI / SkillsMP (`Karanjot786/agent-skills-cli`) | Claims universal CLI syncing 40,000+ skills to multiple clients. | Cursor, Claude Code, GitHub Copilot, OpenAI Codex, Antigravity. | CLI sync from SkillsMP. | Relevant but needs deeper quality/trust verification before using as a core benchmark. |

Conclusion: cross-agent skill marketplaces exist, but most are either installer layers, curated GitHub catalogs, or ecosystem-specific marketplaces with cross-agent adapters. The open product opportunity is a neutral registry with deterministic manifests, compatibility metadata, review status, permission disclosure, versioning, and adapters for multiple clients.

### 3.4 Mature non-AI marketplace patterns worth copying

| Product | Discovery model | Install model | Design implication |
|---|---|---|---|
| VS Code Marketplace | Search, category, rating, install count, publisher identity. | One-click install from editor or `code --install-extension`. | Discovery must be native in the host product and web-accessible. |
| Raycast Store | Curated searchable extension store. | Install from Raycast app. | Strong review and UX polish matter for trust. |
| GitHub Marketplace | Searchable tools/actions/services tied to GitHub identity. | OAuth/app install with permissions. | Permissions must be visible before installation. |
| npm / PyPI | Registry API, semver, package metadata, signed/provenance features increasingly important. | CLI install and dependency resolution. | Use semantic versioning, lockfiles, hashes, and dependency metadata. |

## 4. Key lessons from research

1. GitHub-first wins early: most current skill/plugin marketplaces are GitHub repos with machine-readable manifests and a README/web UI layered on top.
2. CLI install is table stakes: every serious marketplace supports copyable install commands or a native CLI flow.
3. Web discovery is still valuable: users browse visually, but installation often returns to CLI/agent commands.
4. Agent compatibility matters: skills are not universally portable unless metadata declares supported agents, skill schema, tools, OS, and runtime assumptions.
5. Trust is underdeveloped: existing catalogs often rely on stars and curation, but few expose a complete permission/security model for prompts, scripts, and tool access.
6. One-click install is powerful but risky: Cline's pattern of using README/`llms-install.md` for autonomous setup is convenient, but Agent Skill Market should prefer deterministic manifests for safety.
7. Skill markets blur into tool markets: users often want skills, commands, MCP servers, hooks, prompts, and modes in one discovery surface, while the installer needs to keep them type-separated.
8. A meta-skill/authoring assistant can bootstrap supply: marketplaces that help authors create valid skills reduce contribution friction.
9. Cross-agent distribution is happening through `AGENTS.md` and installer adapters, not through every client adopting the same native marketplace UX. Agent Skill Market should therefore separate the registry/package contract from client-specific install adapters.
10. The gap is not basic discovery; several GitHub catalogs already exist. The gap is neutral trust metadata: deterministic manifests, permission disclosure, version pinning, validation reports, and clear compatibility across clients.

## 5. Product goals

### MVP goals

- Search and browse a registry of skills.
- Install a skill into a local agent profile safely and repeatably.
- Publish a skill package from a GitHub repo via validation and PR/review flow.
- Show compatibility, dependencies, and trust metadata before install.
- Support multiple agent runtimes through adapters, starting with Hermes Agent and Claude-style `SKILL.md` packages.

### Non-goals for MVP

- Paid monetization or revenue sharing.
- Hosted execution of skills.
- Full dependency solver for arbitrary languages.
- Automatic execution of unreviewed install scripts.
- Private enterprise registry management, beyond allowing self-hosted registry later.

## 6. Target users

1. Agent users: want high-quality task skills they can install and use immediately.
2. Skill authors: want an easy way to publish, validate, document, and update skills.
3. Agent platform maintainers: want a registry/installer they can integrate without owning marketplace operations.
4. Organizations: later, want an internal curated registry with policy controls.

## 7. Core user flows

### 7.1 Discover

```text
User -> Web UI or CLI search -> Results ranked by relevance, compatibility, trust, freshness -> Show detail page
```

Search facets:

- Query text.
- Category: software-development, research, productivity, creative, devops, etc.
- Compatible agent: Hermes, Claude Code, Codex, OpenCode, Cursor, Gemini CLI, Kilo, generic OpenSkills.
- Package type: skill, command, plugin, MCP server, hook, mode, bundle.
- Required tools: browser, terminal, file, GitHub, MCP, web, image generation, etc.
- OS: macOS, Linux, Windows.
- License.
- Trust level: verified publisher, reviewed, signed, sandbox-safe, no scripts.

### 7.2 Inspect before install

The detail page and CLI `show` command must show:

- Summary and examples.
- Source repo and exact version/ref.
- Files to be installed.
- Required permissions/tools.
- Required environment variables and credentials.
- Optional post-install setup steps.
- Security warnings: scripts, binaries, network calls, shell commands, MCP servers.
- Compatibility matrix.
- Publisher identity and verification.
- Review status, last validation date, and install count.

### 7.3 Install

CLI is the first developer-facing install surface, but it must not be the only install path. Agent Skill Market should support progressive install surfaces for different user types.

Developer CLI examples:

```bash
agent-skill install github-pr-workflow
agent-skill install jkevinxu/video-generation@1.2.0
agent-skill install https://github.com/org/repo/path/to/skill
```

Non-developer install goal:

```text
Marketplace website or in-agent browser -> click Install in <agent> -> agent app opens permission review -> user clicks Install -> skill is ready with example usage
```

Recommended install surfaces, ranked by non-developer friendliness:

1. In-agent marketplace browser
   - User searches and installs without leaving Hermes/Claude/Cursor/Kilo/etc.
   - Best long-term UX because the host agent can show exact compatibility and permissions.

2. Website deep-link install
   - Marketplace page has buttons like `Install in Hermes`, `Install in Claude`, `Install in Cursor`.
   - Button opens the local app with a URL scheme such as `hermes://skills/install?id=<package-id>&version=<version>`.
   - The app must show a permission/changes confirmation screen before writing files.

3. Drag-and-drop `.skill.zip` package
   - User downloads a signed/hashed skill bundle from the marketplace.
   - User drags it into the agent app's Skills settings page or uses `Import Skill Package`.
   - Good fallback for non-developers when deep links or native marketplace browsing are not available.

4. Web copy-install command
   - Marketplace shows a copyable CLI command for developers.
   - This is useful but should be presented as an advanced/manual option, not the primary non-developer path.

5. Project config / lockfile sync
   - Teams can check in `agent-skills.toml` or `.agent/skills.lock`.
   - Developers or CI run `agent-skill sync`; non-developers benefit indirectly through a prepared project.

6. Cloud/profile install
   - For hosted agents, the website can install directly into the user's cloud profile after login and confirmation.
   - This is a later-stage product because it requires accounts, OAuth, policy, and org controls.

Non-developer confirmation screen requirements:

- Explain what the skill does in plain language.
- Show compatible agents and current app/profile target.
- Show files/config that will be added or changed.
- Show permissions: file access, network, shell/scripts, credentials, MCP servers, browser, email/calendar, etc.
- Separate harmless content-only skills from skills that include scripts or external services.
- Require explicit confirmation for scripts, shell commands, credentials, or broad filesystem access.
- Provide `Uninstall` and `Rollback` immediately after install.
- End with a concrete next prompt, e.g. `Try: Use Meeting Notes Summarizer on this transcript.`

Safe install algorithm, shared across CLI, deep links, drag-and-drop, and in-app install:

1. Resolve package ID to registry entry.
2. Fetch manifest and artifact from immutable version/ref.
3. Verify hash/signature if available.
4. Validate package structure and frontmatter.
5. Build install plan: target path, files, permissions, dependencies, scripts.
6. Show install plan in the appropriate UI: CLI text, app dialog, or web-to-app handoff.
7. Ask for confirmation for any sensitive permission.
8. Copy files into profile-specific skill directory.
9. Write lockfile entry with source, version, hash, installed_at.
10. Run non-destructive validation.
11. Print or display next usage instructions.

### 7.4 Update

```bash
agent-skill outdated
agent-skill update <skill>
agent-skill rollback <skill>
```

Updates should be opt-in by default for skills that include scripts, dependencies, or changed permissions. Minor content-only updates can be batch-updated with a preview.

### 7.5 Publish

```bash
agent-skill init
agent-skill validate ./skills/my-skill
agent-skill pack ./skills/my-skill
agent-skill publish ./skills/my-skill --repo owner/repo
```

Publish flow:

1. Author creates skill with `SKILL.md` plus optional manifest.
2. CLI validates schema, links, examples, and install safety.
3. CLI generates package metadata, hash, and registry submission.
4. Registry runs CI validation.
5. Initial MVP uses PR-based review to a registry repo.
6. Later versions support signed publisher accounts and API publishing.

## 8. Package model

### 8.1 Package types

- `skill`: instructions/workflow loaded by an agent.
- `command`: user-invoked slash command or named workflow.
- `plugin`: bundle of skills/commands/hooks/config.
- `mcp-server`: tool server dependency or installable server package.
- `hook`: event-triggered automation.
- `mode`: agent persona/configuration mode.
- `bundle`: curated collection of the above.

### 8.2 Recommended directory layout

```text
my-skill/
  SKILL.md
  skill.toml
  README.md
  examples/
  references/
  templates/
  scripts/
  tests/
```

`SKILL.md` remains the human/agent-readable core. `skill.toml` is the deterministic machine-readable contract.

### 8.3 Example `skill.toml`

```toml
schema_version = "0.1"
id = "jkevinxu.github-pr-workflow"
name = "github-pr-workflow"
title = "GitHub PR Workflow"
description = "Create, review, and manage GitHub pull requests safely."
version = "1.0.0"
license = "MIT"
package_type = "skill"
source = "https://github.com/JKevinXu/agent-skills/tree/main/github-pr-workflow"

[author]
name = "JKevinXu"
github = "JKevinXu"

[compatibility]
agents = ["hermes>=0.1", "claude-code>=1.0"]
os = ["macos", "linux"]

[permissions]
tools = ["terminal", "file"]
network = true
shell = true
writes_files = true
requires_credentials = ["GITHUB_TOKEN"]

[install]
target = "skills/github/github-pr-workflow"
include = ["SKILL.md", "README.md", "references/**", "templates/**", "scripts/**"]
post_install = []

[trust]
review_status = "community-reviewed"
signed = false
```

## 9. Registry data model

### 9.1 Registry entities

- Publisher: identity, verification, signing keys, homepage, GitHub org/user.
- Package: stable package ID, type, title, categories, latest version.
- Version: semver, source ref, artifact URL, hash, manifest, created_at, validation status.
- Compatibility: supported agents, OS, schema versions.
- Permissions: tools, filesystem, shell, network, credentials, MCP servers.
- Review: automated validation results, human curation status, security notes.
- Metrics: installs, stars, update frequency, issues, last successful validation.

### 9.2 Registry API MVP

```text
GET /v0/packages?q=&type=&agent=&category=&limit=&cursor=
GET /v0/packages/{id}
GET /v0/packages/{id}/versions
GET /v0/packages/{id}/versions/{version}
POST /v0/submissions
GET /v0/submissions/{id}
```

Return JSON should be cacheable and mirrorable. A static generated index can be enough for the first MVP; a service can come later.

## 10. Discovery ranking

Initial ranking formula:

```text
score = text_relevance
      + compatibility_boost
      + reviewed_boost
      + freshness_boost
      + install_count_boost
      + source_popularity_boost
      - permission_risk_penalty
      - stale_or_broken_penalty
```

Discovery should never hide risky packages only because they are popular. Show risk badges prominently.

## 11. Security and trust model

Agent skills can influence model behavior and may include scripts or install dependencies. Treat them as supply-chain artifacts.

MVP controls:

- No hidden install actions: print exact file writes and commands.
- No automatic execution of post-install scripts by default.
- Hash every installed artifact.
- Preserve source URL, ref, and hash in lockfile.
- Validate frontmatter and manifest schema.
- Block path traversal and symlinks escaping target directory.
- Show permissions and required credentials before install.
- Warn on shell scripts, binaries, curl-pipe-shell install instructions, or broad filesystem access.
- Review queue for official/featured packages.

Later controls:

- Sigstore or minisign package signatures.
- Publisher verification through GitHub/OIDC.
- Sandboxed script execution.
- Malware/secret scanning.
- Reproducible package builds from Git tags.
- Enterprise policy rules.

## 12. Architecture

### 12.1 MVP architecture

```text
GitHub-hosted skill repos
        |
        v
Registry repo: packages/*.toml + generated index.json
        |
        v
Validation CI: schema, links, package hash, compatibility checks
        |
        +--> Static web UI: browse/search/detail/copy install command
        |
        +--> CLI: search/show/install/update/publish
        |
        +--> Agent adapters: Hermes, Claude Code, generic OpenSkills layout
```

### 12.2 Components

1. Registry index generator
   - Reads package manifests from registry repo.
   - Fetches GitHub metadata and README snippets.
   - Emits `index.json`, search index, and package detail JSON.

2. CLI installer
   - Resolves packages.
   - Validates and installs packages into local agent profile.
   - Maintains lockfile.

3. Web UI
   - Static site first.
   - Search/filter catalog.
   - Package details and risk badges.
   - Copy commands.

4. Validator
   - Schema validation.
   - Agent compatibility checks.
   - File/path safety checks.
   - Optional smoke tests for skills.

5. Adapters
   - Hermes adapter maps packages to `~/.hermes/skills/<category>/<name>/`.
   - Claude adapter can emit plugin marketplace metadata or install into Claude skill directories where supported.
   - Generic adapter exports OpenSkills-style package layout.

## 13. MVP implementation plan

### Phase 0: Repo foundation

- Create `docs/` design docs.
- Define `skill.toml` JSON Schema/TOML Schema.
- Define sample packages.
- Decide package ID naming convention: `<publisher>.<name>`.

### Phase 1: Static registry

- Store package manifests in `registry/packages/<publisher>/<name>.toml`.
- Add validation script.
- Add GitHub Actions validation.
- Generate `public/index.json`.

### Phase 2: CLI and package installer core

- Implement `agent-skill search`, `show`, `install`, `list`, `uninstall`.
- Support local install into Hermes profile first.
- Add lockfile at `~/.agent-skill-market/lock.json` or profile-local equivalent.
- Add safety preview and confirmation.
- Keep installer core UI-agnostic so the same validation/install plan can power CLI, deep links, drag-and-drop imports, and in-app marketplace installs.

### Phase 3: Web discovery and non-developer install MVP

- Static site from generated index.
- Search, facets, package detail pages.
- Copy install commands for developers.
- Add non-developer CTAs: `Install in Hermes`, `Download .skill.zip`, and compatibility-aware install buttons where supported.
- Define deep-link contract such as `hermes://skills/install?id=<package-id>&version=<version>`.
- Define signed/hashed `.skill.zip` bundle format for drag-and-drop import.
- Link source repo and validation report.

### Phase 4: Native app/install integrations

- Hermes `Import Skill Package` UI for `.skill.zip`.
- Hermes deep-link handler that resolves the registry entry, shows permission review, installs after confirmation, and supports rollback.
- In-agent marketplace search/install flow backed by registry APIs.
- OpenSkills/AGENTS.md export for non-Hermes clients.

### Phase 5: Publishing flow

- `agent-skill validate` for authors.
- `agent-skill publish` opens a PR or emits a submission bundle.
- CI comments validation errors.
- Human review labels: experimental, reviewed, official, deprecated.

### Phase 6: Trust and compatibility

- Compatibility matrix by agent.
- Client adapters for Hermes, Claude Code, OpenSkills/AGENTS.md, Codex, Cursor, OpenCode, Kilo, and other compatible clients.
- Hash/signature verification.
- Permission diff on update.
- Security scan for scripts and suspicious install commands.

## 14. Open questions

1. Should the repo support only Hermes skills initially, or be explicitly cross-agent from day one?
   - Recommendation: cross-agent metadata from day one, Hermes installer first, and OpenSkills/AGENTS.md export second. This matches the strongest existing cross-agent distribution pattern while keeping MVP scope bounded.

2. Should packages be copied from Git refs or packed as immutable artifacts?
   - Recommendation: MVP can fetch GitHub tarballs pinned to commit SHA; later add signed artifacts.

3. Should registry submissions be fully open or curated?
   - Recommendation: allow submissions by PR, but distinguish `indexed`, `community-reviewed`, and `featured` statuses.

4. Should skills be allowed to include executable scripts?
   - Recommendation: yes, but require manifest declaration and explicit user confirmation; never auto-run scripts silently.

5. Should MCP servers be first-class packages?
   - Recommendation: include MCP dependencies in skill manifests; add first-class MCP packages only after basic skills work.

6. Is CLI the only install interface?
   - Recommendation: no. CLI should be the first developer-facing implementation, but non-developer UX should prioritize in-agent marketplace browsing, website deep links, and drag-and-drop `.skill.zip` import. The installer core should be shared across all surfaces so safety behavior is consistent.

## 15. Success metrics

MVP success:

- 50 useful indexed skills.
- 10+ categories represented.
- Install success rate above 90% for reviewed skills.
- Search-to-install flow under 60 seconds for developers using CLI.
- Browse-to-install flow under 3 clicks for non-developers when using in-agent marketplace or deep-link install.
- Every package has source, version, hash, compatibility, and permission metadata.
- No install step can execute code without explicit user confirmation.

Longer-term metrics:

- Weekly active installers.
- Publisher retention.
- Skill update adoption.
- Failed install reasons.
- Security review turnaround time.
- Agent platform integrations.

## 16. Recommended next artifact list

1. `schemas/skill.schema.json` or `schemas/skill.toml.md`.
2. `examples/hello-world-skill/`.
3. `registry/packages/jkevinxu/hello-world.toml`.
4. `scripts/validate_registry.py`.
5. `cli/` package skeleton.
6. Static web UI prototype.

## 17. Sources

See `docs/research-sources.md` for researched URLs, GitHub snapshots, and notes.
