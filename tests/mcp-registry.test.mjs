import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  buildSkillIndex,
  findRelevantSkills,
  getSkillBody,
  getSkillManifest,
} from "../src/mcp/registry.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("buildSkillIndex exposes registry packages as digest-pinned skill archive entries", async () => {
  const index = await buildSkillIndex(repoRoot);

  assert.equal(index.schema_version, "0.1");
  assert.ok(Array.isArray(index.skills));

  const skill = index.skills.find((entry) => entry.id === "jkevinxu.meeting-notes-summarizer");
  assert.ok(skill, "meeting notes skill should be present");
  assert.equal(skill.name, "meeting-notes-summarizer");
  assert.equal(skill.version, "1.0.0");
  assert.equal(skill.type, "archive");
  assert.equal(skill.entrypoint, "SKILL.md");
  assert.match(skill.artifact, /dist\/meeting-notes-summarizer\.skill\.zip$/);
  assert.match(skill.digest, /^sha256:[a-f0-9]{64}$/);
  assert.equal(skill.resources.skill, "skill://jkevinxu.meeting-notes-summarizer/1.0.0/SKILL.md");
  assert.deepEqual(skill.permissions.scripts, false);
});

test("findRelevantSkills ranks matching package text", async () => {
  const results = await findRelevantSkills(repoRoot, "meeting transcript action items", 3);

  assert.ok(results.length >= 1);
  assert.equal(results[0].id, "jkevinxu.meeting-notes-summarizer");
  assert.ok(results[0].score > 0);
});

test("getSkillBody returns SKILL.md content for a known skill", async () => {
  const body = await getSkillBody(repoRoot, "jkevinxu.meeting-notes-summarizer");

  assert.match(body, /Meeting Notes Summarizer/i);
  assert.match(body, /action items/i);
});

test("getSkillManifest returns public metadata without leaking local paths", async () => {
  const manifest = await getSkillManifest(repoRoot, "jkevinxu.meeting-notes-summarizer");

  assert.equal(manifest.id, "jkevinxu.meeting-notes-summarizer");
  assert.equal(manifest.package_type, "skill");
  assert.equal(manifest.permissions.shell, false);
  assert.equal(JSON.stringify(manifest).includes(repoRoot), false);
});
