import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_REGISTRY_PATH = "registry/index.json";

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function fileSha256(filePath) {
  const bytes = await fs.readFile(filePath);
  return `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
}

function normalizePackage(pkg) {
  return {
    ...pkg,
    permissions: {
      tools: [],
      network: false,
      shell: false,
      writes_files: false,
      requires_credentials: [],
      ...(pkg.permissions ?? {}),
    },
  };
}

async function loadPackages(repoRoot) {
  const registry = await readJson(path.join(repoRoot, DEFAULT_REGISTRY_PATH));
  return (registry.packages ?? []).map(normalizePackage);
}

function publicArtifactUrl(pkg) {
  if (pkg.bundle?.startsWith("http://") || pkg.bundle?.startsWith("https://")) return pkg.bundle;
  return `https://github.com/JKevinXu/Agent-Skill-Market/raw/main/${pkg.bundle}`;
}

function skillResourceUri(pkg) {
  return `skill://${pkg.id}/${pkg.version}/SKILL.md`;
}

export async function buildSkillIndex(repoRoot) {
  const packages = await loadPackages(repoRoot);
  const skills = [];

  for (const pkg of packages) {
    if (pkg.package_type !== "skill") continue;
    const bundlePath = path.join(repoRoot, pkg.bundle);
    skills.push({
      id: pkg.id,
      name: pkg.name,
      title: pkg.title,
      description: pkg.description,
      version: pkg.version,
      type: "archive",
      artifact: publicArtifactUrl(pkg),
      digest: await fileSha256(bundlePath),
      entrypoint: "SKILL.md",
      publisher: "JKevinXu",
      source: pkg.source,
      compatible_agents: pkg.compatibility?.agents ?? [],
      permissions: {
        scripts: Boolean(pkg.permissions.shell),
        network: Boolean(pkg.permissions.network),
        filesystem: pkg.permissions.writes_files ? "writes-files" : "read-user-provided-files",
        tools: pkg.permissions.tools ?? [],
        requires_credentials: pkg.permissions.requires_credentials ?? [],
      },
      resources: {
        skill: skillResourceUri(pkg),
        manifest: `skill://${pkg.id}/${pkg.version}/manifest.json`,
      },
    });
  }

  return {
    schema_version: "0.1",
    generated_at: new Date(0).toISOString(),
    skills,
  };
}

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export async function findRelevantSkills(repoRoot, query, topK = 5) {
  const packages = await loadPackages(repoRoot);
  const queryTerms = tokenize(query);
  const results = [];

  for (const pkg of packages) {
    const haystack = tokenize([
      pkg.id,
      pkg.name,
      pkg.title,
      pkg.description,
      pkg.category,
      ...(pkg.compatibility?.agents ?? []),
    ].join(" "));
    const hay = new Set(haystack);
    let score = 0;
    for (const term of queryTerms) {
      if (hay.has(term)) score += 2;
      else if (haystack.some((word) => word.includes(term) || term.includes(word))) score += 1;
    }
    if (score > 0) {
      results.push({
        id: pkg.id,
        name: pkg.name,
        title: pkg.title,
        description: pkg.description,
        version: pkg.version,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, topK);
}

async function getPackage(repoRoot, skillId) {
  const packages = await loadPackages(repoRoot);
  const pkg = packages.find((entry) => entry.id === skillId || entry.name === skillId);
  if (!pkg) throw new Error(`Unknown skill: ${skillId}`);
  return pkg;
}

export async function getSkillBody(repoRoot, skillId) {
  const pkg = await getPackage(repoRoot, skillId);
  return fs.readFile(path.join(repoRoot, pkg.skill_file), "utf8");
}

export async function getSkillManifest(repoRoot, skillId) {
  const pkg = await getPackage(repoRoot, skillId);
  return JSON.parse(JSON.stringify(pkg));
}
