// Focused regression test (Node built-in test runner, no new framework).
//
// Root cause under investigation: `svelte-spa-router@5` replaced the v4
// `location` / `querystring` stores with runes-backed getters on a `router`
// singleton (`_loc = $state.raw(...)`, `location`/`querystring` are
// `$derived`). Our components are still compiled in Svelte 5 *legacy* mode, so
// reading `router.querystring` from a `$:` block or from markup does not
// establish a rune subscription: the value is captured once and never updates.
// User-visible symptoms are the `?note`, `?delete` and `?entry` query flows,
// which stop opening/closing their modals and editors.
//
// The fix is a narrow adapter, `src/util/routerState.ts`, that re-exposes the
// same router values as Svelte stores so legacy-mode components can use
// `$location` / `$querystring` again. This test asserts that adapter's
// contract: the exports are legacy-readable stores, they publish the current
// router state on subscribe, they *notify* subscribers when the route changes,
// and they stop notifying after unsubscribe.
//
// Before the fix `src/util/routerState.ts` does not exist, so the import fails
// and every store assertion below fails (RED). After the adapter is added this
// must pass (GREEN) without any change to this test file.
//
// Running this outside a browser needs three pieces of local setup, all
// isolated here rather than in production code:
//
//   1. `window` globals, because the router singleton reads
//      `window.location.href` and subscribes to `hashchange` at import time.
//   2. Module hooks, because `svelte-spa-router` only publishes a `svelte`
//      export condition pointing at an uncompiled `.svelte` file.
//   3. The `browser` export condition (see the `test:router-state` script),
//      because `svelte/store` otherwise resolves to its server build, whose
//      `toStore` is deliberately inert.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { compile } from "svelte/compiler";

if (typeof registerHooks !== "function") {
  throw new Error(
    "This test compiles svelte-spa-router's .svelte entry point through " +
      "module.registerHooks(), which requires Node >= 22.15."
  );
}

const ORIGIN = "http://localhost:5173/";

/** Minimal stand-in for the browser globals the router singleton reads. */
class WindowStub extends EventTarget {
  constructor(href) {
    super();
    this.location = { href };
  }
}

/** Points the stub window at `hash` and fires the event the router listens for. */
function navigate(hash) {
  globalThis.window.location.href = `${ORIGIN}#${hash}`;
  globalThis.window.dispatchEvent(new Event("hashchange"));
}

/** Lets pending Svelte effects flush before assertions read what was published. */
function settle() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

globalThis.window = new WindowStub(`${ORIGIN}#/projects/1/`);

const routerEntry = new URL(
  "../node_modules/svelte-spa-router/dist/Router.svelte",
  import.meta.url
).href;

registerHooks({
  // `svelte-spa-router` exposes its root entry only under the `svelte`
  // condition, which Node does not apply, so resolve it explicitly.
  resolve(specifier, context, nextResolve) {
    if (specifier === "svelte-spa-router") {
      return { url: routerEntry, shortCircuit: true, format: "module" };
    }
    return nextResolve(specifier, context);
  },
  // Compile the router's `.svelte` entry point so Node can evaluate it.
  load(url, context, nextLoad) {
    if (!url.endsWith(".svelte")) return nextLoad(url, context);
    const filename = fileURLToPath(url);
    const { js } = compile(readFileSync(filename, "utf8"), {
      filename,
      generate: "client",
      dev: false,
    });
    return { format: "module", shortCircuit: true, source: js.code };
  },
});

const adapterSpecifier = "../src/util/routerState.ts";
let adapter;
let adapterImportError;
try {
  adapter = await import(adapterSpecifier);
} catch (error) {
  adapterImportError = error;
}

/** Returns the adapter module, failing with a legible reason if it is missing. */
function routerState() {
  assert.ok(
    adapter,
    `expected "${adapterSpecifier}" to export legacy-readable router stores, ` +
      `but importing it failed: ${adapterImportError?.message}`
  );
  return adapter;
}

/** Subscribes to `store`, recording every published value. */
function record(store) {
  const values = [];
  const unsubscribe = store.subscribe((value) => values.push(value));
  return { values, unsubscribe };
}

test("exports legacy-readable stores for location and querystring", () => {
  const { location, querystring } = routerState();
  for (const [name, store] of [
    ["location", location],
    ["querystring", querystring],
  ]) {
    assert.equal(
      typeof store?.subscribe,
      "function",
      `expected "${name}" to be a readable store with a subscribe() method`
    );
  }
});

test("publishes the current router state to a new subscriber", () => {
  const { location, querystring } = routerState();
  navigate("/projects/1/");
  const loc = record(location);
  const qs = record(querystring);
  try {
    assert.deepEqual(loc.values, ["/projects/1/"]);
    assert.deepEqual(qs.values, [""]);
  } finally {
    loc.unsubscribe();
    qs.unsubscribe();
  }
});

test("notifies subscribers when the querystring changes", async () => {
  const { querystring } = routerState();
  navigate("/projects/1/");
  const qs = record(querystring);
  try {
    navigate("/projects/1/?note");
    await settle();
    navigate("/projects/1/");
    await settle();
    navigate("/projects/1/?delete");
    await settle();

    assert.deepEqual(qs.values, ["", "note", "", "delete"]);
  } finally {
    qs.unsubscribe();
  }
});

test("notifies subscribers when the location changes", async () => {
  const { location } = routerState();
  navigate("/projects/1/");
  const loc = record(location);
  try {
    navigate("/projects/2/?entry");
    await settle();
    navigate("/settings");
    await settle();

    assert.deepEqual(loc.values, ["/projects/1/", "/projects/2/", "/settings"]);
  } finally {
    loc.unsubscribe();
  }
});

test("stops notifying after unsubscribe", async () => {
  const { querystring } = routerState();
  navigate("/projects/1/");
  const qs = record(querystring);
  navigate("/projects/1/?note");
  await settle();
  qs.unsubscribe();

  navigate("/projects/1/?delete");
  await settle();

  assert.deepEqual(qs.values, ["", "note"]);
});
