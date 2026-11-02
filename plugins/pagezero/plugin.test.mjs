import assert from "node:assert/strict";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("./", import.meta.url));
const repo = resolve(root, "../..");
const json = path => JSON.parse(readFileSync(path, "utf8"));
const desktop = json(resolve(root, ".codex-plugin/plugin.json"));
const claude = json(resolve(root, ".claude-plugin/plugin.json"));

test("both native catalogs resolve the same self-contained plugin", () => {
  assert.deepEqual(desktop, { ...claude, skills: "./skills/", mcpServers: "./.mcp.json" });
  for (const path of [".agents/plugins/marketplace.json", ".claude-plugin/marketplace.json"]) {
    const catalog = json(resolve(repo, path));
    assert.equal(catalog.name, "pagezero");
    assert.equal(catalog.plugins.length, 1);
    const plugin = catalog.plugins[0];
    assert.equal(plugin.name, desktop.name);
    const source = typeof plugin.source === "string" ? plugin.source : plugin.source.path;
    assert.equal(realpathSync(resolve(repo, source)) + sep, realpathSync(root) + sep);
  }
});

test("Codex desktop compatibility manifest explicitly wires the MCP server", () => {
  assert.equal(realpathSync(resolve(root, desktop.skills)), realpathSync(resolve(root, "skills")));
  const servers = json(resolve(root, desktop.mcpServers)).mcpServers;
  assert.deepEqual(Object.keys(servers), ["pagezero"]);
  assert.equal(servers.pagezero.url, "https://getpagezero.com/api/mcp");
  assert.equal(servers.pagezero.type, "http");
});

test("both hosts share the HTTP connection without bundled credentials", () => {
  const server = json(resolve(root, desktop.mcpServers)).mcpServers.pagezero;
  assert.equal(server.type, "http");
  assert.equal(server.url, "https://getpagezero.com/api/mcp");
  assert.equal(new URL(server.url).username, "");
  assert.equal(new URL(server.url).search, "");
  for (const key of ["headers", "env", "command", "args", "clientSecret"]) assert.equal(key in server, false);
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
