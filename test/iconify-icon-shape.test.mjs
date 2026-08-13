// Focused regression test (Node built-in test runner, no new framework).
//
// Root cause under investigation: `@iconify/svelte@5.2.2` requires
// `props.icon.body` to be a string. The legacy CommonJS data packages
// `@iconify/icons-ic` / `@iconify/icons-mdi` get optimized by Vite into a
// double-wrapped shape (`{ __esModule: true, default: { body, ... } }`),
// so `icon.body` is `undefined` and no `<svg>` is ever rendered.
//
// This test discovers every Iconify icon-data import actually used under
// `src/` (whichever data package they currently come from), dynamically
// imports each module, and asserts the default export directly exposes a
// string `body`. Before the fix (imports from `@iconify/icons-ic` /
// `@iconify/icons-mdi`) this must fail (RED). After migrating the imports to
// `@iconify-icons/ic` / `@iconify-icons/mdi` it must pass (GREEN) without any
// change to this test file.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const srcRoot = path.join(repoRoot, "src");

/** Recursively collect file paths under `dir` matching `.svelte`/`.ts`. */
function collectSourceFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (/\.(svelte|ts)$/.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

// Matches import specifiers for Iconify's `ic`/`mdi` icon-data packages,
// regardless of whether the data package is the legacy
// `@iconify/icons-{set}` name or the maintained `@iconify-icons/{set}`
// successor, e.g.:
//   @iconify/icons-ic/baseline-add
//   @iconify-icons/mdi/github.js
const ICONIFY_IMPORT_RE =
  /from\s+["'](@iconify(?:\/icons-(?:ic|mdi)|-icons\/(?:ic|mdi))\/[\w./-]+)["']/g;

function discoverIconifyImports() {
  const specifiers = new Set();
  for (const file of collectSourceFiles(srcRoot)) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(ICONIFY_IMPORT_RE)) {
      specifiers.add(match[1]);
    }
  }
  return [...specifiers].sort();
}

/** Normalize a specifier to an explicit `.js` suffix for Node resolution. */
function withExplicitJsExtension(specifier) {
  return specifier.endsWith(".js") ? specifier : `${specifier}.js`;
}

const specifiers = discoverIconifyImports();

test("discovers at least one @iconify/icons-ic or @iconify-icons/ic|mdi import under src/", () => {
  assert.ok(
    specifiers.length > 0,
    "expected to find Iconify icon-data imports under src/, found none"
  );
});

for (const specifier of specifiers) {
  test(`${specifier} resolves to a module whose default export has a string body`, async () => {
    const resolved = withExplicitJsExtension(specifier);
    const mod = await import(resolved);
    assert.equal(
      typeof mod.default?.body,
      "string",
      `expected default export of "${resolved}" to have a string "body" ` +
        `property, got shape: ${JSON.stringify(Object.keys(mod.default ?? {}))}`
    );
  });
}
