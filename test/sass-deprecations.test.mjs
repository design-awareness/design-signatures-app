// Focused regression test (Node built-in test runner, no new framework).
//
// Root cause under investigation: this codebase's Sass sources still use two
// patterns Dart Sass has deprecated ahead of the 3.0.0 module-system cutover:
//
//   1. The legacy `@import "foo";` directive (both in shared `.scss` partials
//      and inside 66 `.svelte` `<style lang="scss">` blocks), which Dart Sass
//      reports as `DEPRECATION WARNING [import]`. The replacement is the
//      module system's `@use "foo" as *;`, which preserves the existing
//      un-namespaced variable/mixin/function access these files rely on.
//   2. Deprecated *global* built-in functions - concretely `map-get(...)` in
//      `src/styles/type.scss` and in the handful of `.svelte` files that call
//      it directly on `$type-*` maps - which Dart Sass reports as
//      `DEPRECATION WARNING [global-builtin]`. The replacement is the
//      namespaced `sass:map` module function `map.get(...)`.
//
// This test performs a static source scan (no Sass compiler invocation, so it
// stays fast and has no build dependency) asserting that no app-owned Sass or
// Svelte style source contains either deprecated pattern. It must fail (RED)
// before the migration and pass (GREEN) only once every matching file has
// been converted.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));

/**
 * Recursively collect files under `dir` (relative to repo root) whose name
 * matches one of `exts`.
 */
function collectFiles(dir, exts) {
  /** @type {string[]} */
  const results = [];
  const absDir = resolve(root, dir);
  for (const entry of readdirSync(absDir, { withFileTypes: true })) {
    const relPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      results.push(...collectFiles(relPath, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(relPath);
    }
  }
  return results;
}

const sourceFiles = collectFiles("src", [".scss", ".svelte"]);

assert.ok(
  sourceFiles.length > 50,
  `expected to find the app's Sass/Svelte sources under src/, found ${sourceFiles.length}`
);

// Matches a legacy Sass `@import "...";` directive. Deliberately does not
// match `@use`/`@forward`, and does not match plain CSS `@import url(...)`
// (which takes an unquoted `url()` argument and is unrelated to Sass
// partials), so it only flags the deprecated Sass-partial import form.
const LEGACY_IMPORT_RE = /@import\s+["'][^"']+["']\s*;/;

// Matches a call to the deprecated *global* `map-get` built-in. A namespaced
// call such as `map.get(...)` is intentionally not matched.
const GLOBAL_MAP_GET_RE = /(?<![.\w-])map-get\s*\(/;

test("no app Sass/Svelte source uses the legacy @import directive", () => {
  const offenders = [];
  for (const file of sourceFiles) {
    const content = readFileSync(resolve(root, file), "utf8");
    if (LEGACY_IMPORT_RE.test(content)) {
      offenders.push(file);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `found legacy Sass @import directives (should be @use) in:\n${offenders.join("\n")}`
  );
});

test("no app Sass/Svelte source calls the deprecated global map-get built-in", () => {
  const offenders = [];
  for (const file of sourceFiles) {
    const content = readFileSync(resolve(root, file), "utf8");
    if (GLOBAL_MAP_GET_RE.test(content)) {
      offenders.push(file);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `found deprecated global map-get(...) calls (should be map.get(...) via '@use "sass:map"') in:\n${offenders.join(
      "\n"
    )}`
  );
});

test("src/styles/type.scss uses the sass:map module for map access", () => {
  const content = readFileSync(resolve(root, "src/styles/type.scss"), "utf8");
  assert.match(
    content,
    /@use\s+["']sass:map["']/,
    'expected src/styles/type.scss to declare `@use "sass:map";`'
  );
});
