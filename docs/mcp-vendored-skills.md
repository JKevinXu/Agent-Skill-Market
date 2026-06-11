# MCP-Vendored Skills for Agent Skill Market

Status: Research/design note v0.1
Date: 2026-06-08
Repo: JKevinXu/Agent-Skill-Market

## Executive summary

Yes: skills can be distributed through MCP, but there are two distinct meanings of “vendored via MCP”:

1. Runtime / installless vendoring: an MCP server exposes skill content as MCP resources or tools, and the agent reads the skill when connected. No local skill folder is written.
2. Registry / installer vendoring: an MCP server advertises installable skill artifacts, the client downloads and verifies them, then writes them into its normal local skills directory.

Both patterns already exist in the ecosystem. The strongest standards-track direction is the MCP Skills Over MCP working group’s resource-based draft, which exposes `SKILL.md` and supporting files through MCP resources such as `skill://index.json` and `skill://...`. The strongest practical installer precedent is fast-agent’s SEP-2640-style support: connected MCP servers can act as skill registries, `skill://index.json` lists installable artifacts with SHA-256 digests, and `/skills add` installs the selected artifact into the normal managed skills directory.

Recommendation for Agent Skill Market:

- Short term: add a remote MCP server endpoint for the market that exposes each listed skill as MCP tools/resources for discovery and runtime reading.
- Medium term: implement the SEP-2640 / `skill://index.json` registry shape so compatible clients can install skills from the market through MCP.
- Do not expect this to solve browser-triggered local Codex installation today. MCP can avoid copying skill folders if the host supports MCP-served skills, but Codex currently distributes skills through plugins and local installed skills. A browser still cannot directly write local Codex config without a local helper or native Codex deep link.

## Existing solutions found

### 1. Skills Over MCP working group / experimental MCP extension

Source:
- https://github.com/modelcontextprotocol/experimental-ext-skills
- https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/docs/sep-draft-skills-extension.md
- https://modelcontextprotocol.io/community/skills-over-mcp/charter

What it does:

The experimental extension defines a convention for serving Agent Skills over MCP using existing MCP Resources. A skill remains an Agent Skills directory with `SKILL.md` plus optional supporting files. The transport binding is MCP: each file is exposed as a resource, conventionally under the `skill://` URI scheme. A well-known `skill://index.json` may enumerate concrete skills and templates, but is not mandatory.

Important implications:

- It does not require a new MCP primitive; it uses existing Resources.
- It is compatible with progressive disclosure: list summaries first, fetch `SKILL.md` / references only when needed.
- It supports installless availability: if the MCP server is connected, the skill can be available; disconnecting removes it.
- The draft is explicitly experimental, not an official stable MCP spec yet.

Design takeaway:

Agent Skill Market should shape its MCP endpoint around `skill://index.json` and resource URIs, because this is the direction the MCP working group is incubating.

### 2. Skills Over MCP hosted service

Source:
- https://skillsovermcp.com/
- Example page: https://skillsovermcp.com/connect/mattpocock/skills
- Article: https://dev.to/spencerpauly/introducing-skills-over-mcp-the-better-way-to-share-and-distribute-skills-bb

What it does:

Skills Over MCP turns a public GitHub repository containing `SKILL.md` files into a live MCP server. The homepage describes the flow as:

1. Put skills in a public GitHub repo.
2. Paste the repo URL.
3. Get a stable MCP endpoint such as `mcp.skillsovermcp.com/mcp/<owner>/<repo>`.
4. Add that endpoint to an MCP-aware client.

The service says each `SKILL.md` becomes a callable tool, auto-updating when the GitHub repo changes.

Design takeaway:

This is almost exactly the “host any market skill pack as MCP” model. Agent Skill Market can offer a similar endpoint per publisher/repo/package:

```text
https://mcp.agent-skill.market/mcp/<publisher>/<package>
https://mcp.agent-skill.market/mcp/registry
```

However, treating each skill as a tool is more universally consumable today than pure `skill://` resources, because many MCP clients expose tools better than resources. The market should support both:

- `skills_find_relevant`, `skills_get_body`, `skills_get_reference`, etc. as tools.
- `skill://index.json` and `skill://<id>/SKILL.md` as resources.

### 3. skills-mcp by Jignesh Ponamwar

Source:
- https://github.com/Jignesh-Ponamwar/skills-mcp
- https://skills-mcp-jignesh.vercel.app/

What it does:

`skills-mcp` positions itself as “Agent Skills — delivered over MCP.” It provides a shared, searchable skill library that MCP agents load at runtime instead of bundling skill files into every tool or repo.

Its README describes a 3-tier progressive disclosure model with tools such as:

- `skills_find_relevant(query, top_k)`
- `skills_list_all(limit, offset)`
- `skills_get_body(skill_id, version?)`
- `skills_get_options(skill_id)`
- `skills_get_reference(skill_id, filename)`
- `skills_run_script(skill_id, filename, input_data)`
- `skills_get_asset(skill_id, filename)`

Design takeaway:

This is the best concrete API pattern for Agent Skill Market’s MCP tool surface. It makes discovery, lazy loading, references, scripts, and assets explicit. It is especially useful for clients that do not yet treat MCP resources as first-class model-readable content.

### 4. Skillz MCP server

Source:
- https://github.com/intellectronica/skillz

What it does:

Skillz is an MCP server that turns Claude-style skills (`SKILL.md` plus optional resources) into callable tools for any MCP client. It discovers each skill, exposes authored instructions/resources, and can run bundled helper scripts. It supports local skill directories and packaged `.zip` / `.skill` archives.

The README explicitly warns that this is experimental and potentially unsafe, and recommends treating skills like untrusted code and running in sandboxes/containers.

Design takeaway:

This validates the “MCP adapter over a skill directory” pattern. Agent Skill Market can ship a local MCP adapter that points at a market-managed cache directory, but script execution must be opt-in, sandboxed, and disclosed.

### 5. fast-agent SEP-2640-style skill registry support

Source:
- https://fast-agent.ai/mcp/skills-over-mcp/

What it does:

fast-agent documents support for the registry and installation portion of SEP-2640. In this model:

- An MCP server advertises the `io.modelcontextprotocol/skills` extension capability.
- The client sees the MCP server as a skills registry.
- `/skills registry` reads `skill://index.json`.
- Installable entries are `skill-md` or archive entries with valid `sha256:` digests.
- Installing downloads the artifact, verifies SHA-256, and writes the skill into the normal managed skills directory.
- Installed skills behave like other local skills and include MCP provenance plus artifact digest metadata.

Limitations noted by fast-agent:

- This implementation uses MCP as a registry for installation.
- It does not expose MCP-served skill resources directly to the model.
- It does not make active skills read supporting files from the MCP server.

Design takeaway:

This is the most relevant path for “browser/remote registry causes local install” without inventing an unsafe browser bridge — but only inside a client that supports MCP-backed skill registries. Agent Skill Market should implement this index shape because it gives compatible clients a safe install flow with hashes and provenance.

### 6. NimbleBrain skill resources and registry metadata

Source:
- https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/docs/experimental-findings.md
- https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/docs/approaches.md
- https://github.com/NimbleBrainInc/skills
- NimbleBrain registry metadata discussed in the MCP working-group docs

What it does:

The MCP working group notes that NimbleBrain consolidated MCP server code, skills, and registry metadata into atomic repos. Skills are exposed as `skill://` resources on the server itself. They also explored registry metadata with `.skill` artifact bundles.

Reported findings in the working group docs:

- Colocating skills with the MCP server simplified build, versioning, and deployment.
- `skill://` resources enable ephemeral/installless availability without git clone or filesystem access.
- The skill context is versioned and shipped with the tools it describes.

Design takeaway:

For MCP-server-specific skills, colocate them with the MCP server and expose them through the same server. For general-purpose marketplace skills, use a registry MCP server.

### 7. Other working-group implementations

Source:
- https://github.com/modelcontextprotocol/experimental-ext-skills/blob/main/docs/related-work.md

The MCP working group lists several related implementations:

- `olaservo/skilljack-mcp`: `SKILL.md`, `skill://` resources, tools/prompts, progressive disclosure, dynamic file watching.
- `keithagroves/skills-over-mcp`: `SKILL.md`, `skill://` resources, progressive disclosure, Agent Skills validation.
- `PederHP/skillsdotnet`: C# implementation with `skill://` resources, `load_skill` tool, file hashes, NuGet distribution.
- `kurtisvg/skillful-mcp`: alternative tool-based approach with `list_skills`, `use_skill`, `read_resource`, and `execute_code`.

Design takeaway:

There is already an emerging consensus around two compatible surfaces:

- resource-based `skill://` access for clients that understand MCP resources;
- tool-based skill discovery/loading for clients with better tool support.

## Can this solve Agent Skill Market’s Codex install problem?

Partially.

What MCP can solve:

- Discovery: Codex or another MCP-aware client could connect to an Agent Skill Market MCP server and list/search skills.
- Runtime usage: if Codex exposes MCP tools/resources to the model and the model follows the workflow, a skill can be available without local installation.
- Safe installation: if Codex implements a SEP-2640-style skill registry client, it could install a skill from `skill://index.json` after verifying SHA-256.

What MCP cannot solve by itself today:

- A public website cannot call local Codex CLI directly.
- A remote MCP server cannot write to the user’s local `~/.codex` or Codex plugin directory unless the local Codex client exposes an install capability and asks the user for confirmation.
- Codex’s current documented distribution path says skills are packaged inside plugins for reusable distribution, and local install uses the Codex plugin/skill mechanisms. MCP does not automatically convert a remote skill into a first-class installed Codex plugin.

So the answer is:

- Yes, Agent Skill Market can vend skills over MCP.
- No, this does not make the website’s “Install in Codex” button perform a local install unless Codex adds MCP-backed skill registry support or we provide a local helper app.

## Recommended Agent Skill Market architecture

### Phase 1: Add market MCP server for discovery and runtime use

Expose one MCP server for the registry:

```text
https://mcp.agent-skill-market.example/mcp
```

Tools:

```text
skills_find_relevant(query, top_k, compatible_agent?)
skills_list_all(limit, offset, filters?)
skills_get_body(skill_id, version?)
skills_get_options(skill_id, version?)
skills_get_reference(skill_id, filename, version?)
skills_get_asset(skill_id, filename, version?)
skills_get_manifest(skill_id, version?)
```

Resources:

```text
skill://index.json
skill://jkevinxu.meeting-notes-summarizer/1.0.0/SKILL.md
skill://jkevinxu.meeting-notes-summarizer/1.0.0/references/<file>
skill://jkevinxu.meeting-notes-summarizer/1.0.0/assets/<file>
```

Prompts, optional:

```text
prompts/list -> install_skill, inspect_skill, use_skill
prompts/get install_skill(skill_id)
```

This gives immediate value to MCP clients even without local installation.

### Phase 2: Add SEP-2640-style install registry

Publish `skill://index.json` entries with digest-pinned artifacts:

```json
{
  "schema_version": "0.1",
  "generated_at": "2026-06-08T00:00:00Z",
  "skills": [
    {
      "id": "jkevinxu.meeting-notes-summarizer",
      "name": "meeting-notes-summarizer",
      "version": "1.0.0",
      "type": "archive",
      "artifact": "https://github.com/JKevinXu/Agent-Skill-Market/raw/main/dist/meeting-notes-summarizer.skill.zip",
      "digest": "sha256:<hex>",
      "entrypoint": "SKILL.md",
      "publisher": "JKevinXu",
      "source": "https://github.com/JKevinXu/Agent-Skill-Market/tree/main/skills/meeting-notes-summarizer",
      "compatible_agents": ["hermes", "claude-code", "codex", "openskills", "generic-mcp"],
      "permissions": {
        "scripts": false,
        "network": false,
        "filesystem": "read-user-provided-files"
      }
    }
  ]
}
```

Clients that support MCP-backed skill registries can install locally after verifying the digest. Others can still consume via tools/resources.

### Phase 3: Per-skill or per-publisher MCP endpoints

Add stable endpoints that can be shared from the website:

```text
https://mcp.agent-skill-market.example/mcp/registry
https://mcp.agent-skill-market.example/mcp/jkevinxu/meeting-notes-summarizer
https://mcp.agent-skill-market.example/mcp/github/JKevinXu/Agent-Skill-Market
```

This mirrors Skills Over MCP and makes every GitHub skill repo mountable as a live MCP server.

### Phase 4: Local helper only if needed

For clients like Codex that do not yet implement MCP-backed skill installs, keep the local helper idea separate:

- Website opens `agent-skill-market://install?...`.
- Local helper shows a permission screen.
- Helper runs Codex CLI plugin install or writes the supported local config.

This should be a fallback for local install UX, not the primary MCP design.

## Trust and security model

MCP-vendored skills increase convenience but also increase supply-chain risk. Minimum requirements:

1. Digest-pin every installable artifact with SHA-256.
2. Show source URL, publisher, version/ref, and last validation result.
3. Separate “read instructions” from “execute scripts”.
4. Never run bundled scripts unless the user explicitly consents.
5. Prefer text resources and templates over executable helpers.
6. If scripts are supported, run them in a sandbox/container and disclose inputs/outputs.
7. Include provenance metadata in installed sidecars:

```json
{
  "installed_from": "mcp://mcp.agent-skill-market.example/mcp",
  "skill_uri": "skill://jkevinxu.meeting-notes-summarizer/1.0.0/SKILL.md",
  "artifact_digest": "sha256:<hex>",
  "source_repo": "https://github.com/JKevinXu/Agent-Skill-Market",
  "installed_at": "2026-06-08T00:00:00Z"
}
```

8. Treat third-party MCP servers as trust boundaries. Connecting to a server should not imply silent permanent skill installation.

## Product implications for the website

The website should add a new install/connect option:

```text
Use via MCP
```

For each skill detail page, show:

```text
MCP registry endpoint:
https://mcp.agent-skill-market.example/mcp

Skill resource:
skill://jkevinxu.meeting-notes-summarizer/1.0.0/SKILL.md

Compatible clients:
- Fast-agent: supports MCP-backed skill registry install flow.
- Generic MCP clients: can call tools/resources if exposed by the client.
- Codex: can connect MCP servers, but first-class skill installation still requires Codex plugin/CLI support unless Codex adds MCP skill registry support.
```

Button taxonomy should be honest:

- “Install in Hermes” only if Hermes implements a local deep link or CLI-backed install.
- “Copy Codex install command” for current Codex plugin flow.
- “Connect via MCP” for runtime/registry access.
- “Download .skill.zip” for manual import/future clients.

## Open questions

1. Should Agent Skill Market host MCP itself, or delegate per-repo hosting to services like Skills Over MCP?
2. Should the market expose each skill as tools, resources, prompts, or all three?
3. How should compatibility metadata distinguish “installable as native skill” from “usable via MCP runtime context”?
4. Should scripts be disabled entirely for public skills in v1?
5. Should Agent Skill Market support private/org skill registries, or focus on public skills first?
6. Can Hermes add first-class support for `skill://index.json` registry installs?
7. Can Codex be convinced to support SEP-2640-style skill registry install, or will it remain plugin-based?

## Concrete next steps

1. Add an `mcp` section to `registry/index.json` with resource URI and registry endpoint fields.
2. Add a “Connect via MCP” button to the website.
3. Build a minimal FastMCP or TypeScript MCP server that serves the existing `registry/index.json` as:
   - `skills_list_all`
   - `skills_get_body`
   - `skills_get_manifest`
   - `skill://index.json`
   - `skill://<id>/<version>/SKILL.md`
4. Add SHA-256 digest generation for `dist/*.skill.zip` and publish it in both the registry JSON and MCP index.
5. Test with an MCP client that exposes tools/resources to the model.
6. Keep Codex CLI/plugin install as a separate path until Codex supports MCP-backed skill installs.

## Bottom line

MCP is a very good distribution and runtime-consumption layer for skills. It is already being explored by the MCP working group and implemented by several projects. For Agent Skill Market, MCP should become the third install/use path alongside native agent plugins and downloadable `.skill.zip` bundles:

```text
Browse on website -> inspect trust metadata -> choose one:
1. Native install command / plugin install
2. Connect via MCP for runtime skill access
3. Download verified .skill.zip artifact
```

This gives Agent Skill Market a standards-aligned path that does not depend on browser deep links or Codex-specific UI behavior.
