import assert from "node:assert/strict";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("./", import.meta.url));
const repo = resolve(root, "../..");
const json = path => JSON.parse(readFileSync(path, "utf8"));
const portable = json(resolve(root, "plugin.json"));
const claude = json(resolve(root, ".claude-plugin/plugin.json"));

test("both native catalogs resolve the same self-contained plugin", () => {
  assert.deepEqual(claude, Object.fromEntries(Object.entries(portable).filter(([key]) => key !== "$schema")));
  for (const path of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"]) {
    const catalog = json(resolve(repo, path));
    assert.equal(catalog.name, "pagezero");
    assert.equal(catalog.plugins.length, 1);
    const plugin = catalog.plugins[0];
    assert.equal(plugin.name, portable.name);
    const source = typeof plugin.source === "string" ? plugin.source : plugin.source.path;
    assert.equal(realpathSync(resolve(repo, source)) + sep, realpathSync(root) + sep);
  }
});

test("each host uses its native HTTP transport without bundled credentials", () => {
  const codex = json(resolve(root, "mcp.json")).mcpServers.pagezero;
  const claude = json(resolve(root, ".mcp.json")).mcpServers.pagezero;
  assert.equal(codex.type, "streamable-http");
  assert.equal(claude.type, "http");
  assert.equal(codex.url, "https://getpagezero.com/api/mcp");
  assert.equal(claude.url, codex.url);
  assert.deepEqual(codex.extensions["com.openai"].auth, { type: "oauth", client: { mode: "cimd" } });
  for (const server of [codex, claude]) {
    assert.equal(new URL(server.url).username, "");
    assert.equal(new URL(server.url).search, "");
    for (const key of ["headers", "env", "command", "args", "clientSecret"]) assert.equal(key in server, false);
  }
});

test("all five public workflows ship inside the plugin with explicit site selection", () => {
  const names = ["pagezero-content-improvement", "pagezero-sdk-installation", "pagezero-site-audit", "pagezero-traffic-reporting", "pagezero-visibility-tracking"];
  assert.deepEqual(readdirSync(resolve(root, "skills")).sort(), names);
  for (const name of names) {
    const file = realpathSync(resolve(root, "skills", name, "SKILL.md"));
    assert(file.startsWith(realpathSync(root) + sep));
    const content = readFileSync(file, "utf8");
    assert(content.startsWith(`---\nname: ${name}\n`));
    assert(content.includes("site_id"));
    assert(content.includes("listSites"));
  }
});
