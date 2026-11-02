#!/usr/bin/env node
/**
 * Fail when an Omneky Cursor skill names a tool /mcp tools/list does not carry.
 *
 * Same rule as public-mcp tests/test_skill_tool_names.py (commit 7fa13a92):
 * a backticked name that is a known Omneky tool must be in the checked-in
 * /mcp listing. tool-name-fallbacks.md is excluded; its job is to name older
 * tools. Argument names are not in the known catalog, so they are ignored.
 *
 *   node scripts/check-omneky-mcp-tool-names.mjs
 *   node scripts/check-omneky-mcp-tool-names.mjs --skills /path/to/skills
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const snapshotPath = path.join(repoRoot, "plugins/omneky/tests/mcp_tool_names.txt");
const knownPath = path.join(repoRoot, "plugins/omneky/tests/known_tool_names.txt");
const fallbackFile = "tool-name-fallbacks.md";
const ticked = /`([a-z][a-z0-9_]+)`/g;

function loadNames(filePath) {
  const names = new Set();
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const name = line.replace(/#.*/, "").trim();
    if (!name) continue;
    if (!/^[a-z][a-z0-9_]+$/.test(name)) {
      console.error(`${filePath}: invalid tool name ${JSON.stringify(name)}`);
      process.exit(1);
    }
    if (names.has(name)) {
      console.error(`${filePath}: duplicate tool name ${name}`);
      process.exit(1);
    }
    names.add(name);
  }
  return names;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith(".md") || entry.endsWith(".json")) out.push(full);
  }
  return out;
}

function skillsRootFromArgv(argv) {
  const flag = argv.indexOf("--skills");
  if (flag === -1) return path.join(repoRoot, "plugins/omneky/skills");
  const value = argv[flag + 1];
  if (!value) {
    console.error("--skills requires a directory");
    process.exit(1);
  }
  return path.resolve(value);
}

const listed = loadNames(snapshotPath);
const known = loadNames(knownPath);
const missingFromKnown = [...listed].filter((name) => !known.has(name));
if (missingFromKnown.length) {
  console.error(
    "mcp_tool_names.txt has names missing from known_tool_names.txt:\n" +
      missingFromKnown.join("\n"),
  );
  process.exit(1);
}

const skillsRoot = skillsRootFromArgv(process.argv.slice(2));
const bad = [];
const unique = new Set();
for (const file of walk(skillsRoot)) {
  if (path.basename(file) === fallbackFile) continue;
  const text = readFileSync(file, "utf8");
  const names = new Set();
  for (const match of text.matchAll(ticked)) names.add(match[1]);
  for (const name of [...names].sort()) {
    if (known.has(name) && !listed.has(name)) {
      unique.add(name);
      bad.push(`${path.relative(repoRoot, file)}: \`${name}\``);
    }
  }
}

if (bad.length) {
  console.error(
    `${unique.size} unique tool name(s) are not on the /mcp tools/list ` +
      `(${bad.length} mention(s); ${fallbackFile} excluded):\n` +
      bad.join("\n"),
  );
  process.exit(1);
}

console.log(
  `ok: 0 stale tool names in ${path.relative(repoRoot, skillsRoot)} ` +
    `(${listed.size} /mcp tools/list names)`,
);
