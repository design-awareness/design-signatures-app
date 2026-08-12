# Svelte 5 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the application from Svelte 3 and Rollup to Svelte 5 and Vite without converting components to runes or changing user-facing behavior.

**Architecture:** Vite will compile the existing legacy-mode Svelte components, serve static assets, inject the existing build metadata, and emit both the application and a module service worker. Framework-coupled dependencies will move together; unrelated dependencies and legacy UI libraries remain unchanged unless a demonstrated incompatibility is reviewed with the user.

**Tech Stack:** Node.js 22.12+, Svelte 5.56.x, Vite 8.2.x, `@sveltejs/vite-plugin-svelte` 7.3.x, TypeScript 5.9.x, Sass, Workbox, Netlify

## Global Constraints

- Support Node.js 22 with a minimum version of 22.12.
- Keep existing components in Svelte legacy mode; do not convert them to runes.
- Upgrade only Svelte/build dependencies and maintained Svelte integrations.
- Do not replace `svelte-collapsible`, `svelte-snappy-carousel`, or the GitHub-sourced masonry package without explicit user approval.
- Preserve the `build/` production output directory and all current public URLs used by Netlify and the PWA.
- Prefer maintained upstream types over local declaration shims and dependency-era workarounds.
- Surface installation, compilation, and runtime failures; do not hide them behind fallbacks.
- Complete manual end-to-end verification collaboratively with the user.

---

## File Map

- Create `.nvmrc` to select the Node.js 22 development runtime.
- Create `vite.config.ts` to own Svelte compilation, build metadata, icon copying, application bundling, and service-worker bundling.
- Move `public/index.html` to `index.html` and convert it into Vite's HTML entry.
- Modify `package.json` and `package-lock.json` for the Node engine, Vite scripts, and targeted dependency upgrades.
- Modify `svelte.config.js` to use Vite's Svelte preprocessor.
- Modify `tsconfig.json` for the modern Svelte/Vite TypeScript environment.
- Modify `.github/workflows/validate.yml` to use Node.js 22 and validate both checking and production compilation.
- Modify `src/main.ts` to use Svelte 5's `mount` API and module service-worker registration.
- Modify `src/service-worker.ts` so Vite-generated asset URLs are cached.
- Modify `src/data/buildData.ts` and `global.d.ts` to type injected build constants without `@ts-ignore`.
- Modify `src/App.svelte` and router consumers to use the supported `svelte-spa-router` 5 entry point.
- Modify the 18 components importing `@iconify/svelte/dist/Icon.svelte` to use the package root export.
- Modify `src/types/ComponentConstructor.ts` and `src/components/SegmentedComponentSelector.svelte` only as required by Svelte 5's component types.
- Modify or remove `src/types/svelte-collapsible.d.ts` only if upstream-compatible types make the shim unnecessary.
- Remove `rollup.config.js` after Vite reproduces all of its responsibilities.

---

### Task 1: Establish the Node.js 22 Baseline

**Files:**
- Create: `.nvmrc`
- Modify: `package.json:4-9`
- Modify: `.github/workflows/validate.yml:12-30`

**Interfaces:**
- Consumes: Existing npm scripts and lockfile.
- Produces: A declared Node.js runtime of `>=22.12 <23` used locally and in CI.

- [ ] **Step 1: Capture the pre-migration baseline**

Run:

```bash
node --version
npm ci
npm run validate
npm run build
```

Expected: dependency installation, Svelte checking, and the Rollup production
build all succeed before migration. Record any pre-existing warning separately
instead of fixing unrelated behavior.

- [ ] **Step 2: Declare the local Node.js runtime**

Create `.nvmrc`:

```text
22
```

Add this top-level field to `package.json`:

```json
"engines": {
  "node": ">=22.12 <23"
}
```

- [ ] **Step 3: Update CI to the supported runtime**

Update `.github/workflows/validate.yml` to use current action releases and run
both checks:

```yaml
- uses: actions/checkout@v4

- name: Use Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "22"
    cache: npm

- name: Install dependencies
  run: npm ci

- name: Validate
  run: npm run validate

- name: Build
  run: npm run build
```

Remove the separate `actions/cache` step because `setup-node` owns the npm
cache.

- [ ] **Step 4: Verify the runtime-only change**

Run:

```bash
npm ci
npm run validate
npm run build
```

Expected: all three commands exit successfully with the existing Svelte 3 and
Rollup toolchain.

- [ ] **Step 5: Commit the Node baseline**

```bash
git add .nvmrc package.json .github/workflows/validate.yml
git commit -m "build: require Node 22"
```

---

### Task 2: Replace Rollup with the Svelte 5 Vite Toolchain

**Files:**
- Create: `vite.config.ts`
- Create: `index.html`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `svelte.config.js`
- Modify: `tsconfig.json`
- Modify: `src/main.ts`
- Modify: `src/service-worker.ts`
- Modify: `src/data/buildData.ts`
- Modify: `global.d.ts`
- Delete: `public/index.html`
- Delete: `rollup.config.js`

**Interfaces:**
- Consumes: Netlify environment variables `PULL_REQUEST`, `REVIEW_ID`, `HEAD`,
  `BRANCH`, `REPOSITORY_URL`, and `FEEDBACK_LINK_URL`.
- Produces: `build/index.html`, hashed application files under `build/assets/`,
  `build/service-worker.js`, environment-specific files under `build/icons/`,
  and the existing build constants consumed by `src/data/buildData.ts`.

- [ ] **Step 1: Replace the framework-coupled dependencies**

Update the scripts in `package.json`:

```json
"scripts": {
  "build": "vite build",
  "dev": "vite",
  "start": "vite preview --host",
  "validate": "svelte-check --tsconfig ./tsconfig.json"
}
```

Add or upgrade these development dependencies:

```json
"@sveltejs/vite-plugin-svelte": "^7.3.0",
"@tsconfig/svelte": "^5.0.8",
"sass": "^1.102.0",
"svelte": "^5.56.9",
"svelte-check": "^4.7.5",
"typescript": "^5.9.3",
"vite": "^8.2.1",
"vite-plugin-static-copy": "^4.1.1"
```

Remove these Rollup-specific dependencies:

```text
@rollup/plugin-commonjs
@rollup/plugin-node-resolve
@rollup/plugin-replace
@rollup/plugin-typescript
rollup
rollup-plugin-copy
rollup-plugin-css-only
rollup-plugin-livereload
rollup-plugin-svelte
rollup-plugin-terser
sirv-cli
svelte-preprocess
```

Run:

```bash
npm install
```

Expected: npm regenerates `package-lock.json` without a peer-dependency error.
If npm reports an incompatibility involving `svelte-collapsible`,
`svelte-snappy-carousel`, or `svelte-masonry`, stop and show that exact failure
to the user before changing the library.

- [ ] **Step 2: Configure Svelte preprocessing and TypeScript**

Replace `svelte.config.js` with:

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
};
```

Set `"type": "module"` in `package.json`. Update `tsconfig.json` to preserve
strict checking while using Vite's module resolution:

```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "types": ["resize-observer-browser"]
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts",
    "src/**/*.svelte",
    "global.d.ts",
    "vite.config.ts"
  ]
}
```

- [ ] **Step 3: Create the Vite HTML entry**

Move `public/index.html` to the repository root as `index.html`. Remove the
Rollup bundle stylesheet and script tags:

```html
<link rel="stylesheet" href="/build/bundle.css" />
<script defer src="/build/bundle.js"></script>
```

Keep `/index.css`, the manifest, icons, and font stylesheet. Add this module
entry before `</body>`:

```html
<script type="module" src="/src/main.ts"></script>
```

- [ ] **Step 4: Implement Vite build metadata and output configuration**

Create `vite.config.ts` with:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const root = fileURLToPath(new URL(".", import.meta.url));
const packageJson = JSON.parse(
  readFileSync(resolve(root, "package.json"), "utf8")
) as { version: string };

const optionalString = (value: string | undefined): string =>
  value === undefined ? "undefined" : JSON.stringify(value);

export default defineConfig(({ command }) => {
  const production = command === "build";
  const buildEnvironment = !production
    ? "dev"
    : process.env.PULL_REQUEST === "true"
      ? "preview"
      : "prod";

  return {
    plugins: [
      svelte(),
      viteStaticCopy({
        targets: [
          {
            src: `icons/icons-${buildEnvironment}/*`,
            dest: "icons",
          },
        ],
      }),
    ],
    define: {
      BUILDVAR__BUILD_TIME: JSON.stringify(Date.now()),
      BUILDVAR__VERSION: JSON.stringify(packageJson.version),
      BUILDVAR__BUILD_ENV: JSON.stringify(buildEnvironment),
      BUILDVAR__BRANCH: optionalString(process.env.BRANCH),
      BUILDVAR__PULL_REQUEST: optionalString(process.env.REVIEW_ID),
      BUILDVAR__GIT_HEAD: optionalString(process.env.HEAD),
      BUILDVAR__GIT_REPO: optionalString(process.env.REPOSITORY_URL),
      BUILDVAR__FEEDBACK_LINK:
        process.env.FEEDBACK_LINK_URL === undefined
          ? "null"
          : JSON.stringify(process.env.FEEDBACK_LINK_URL),
    },
    build: {
      outDir: "build",
      sourcemap: !production,
      rollupOptions: {
        input: {
          app: resolve(root, "index.html"),
          "service-worker": resolve(root, "src/service-worker.ts"),
        },
        output: {
          entryFileNames: (chunk) =>
            chunk.name === "service-worker"
              ? "service-worker.js"
              : "assets/[name]-[hash].js",
        },
      },
    },
  };
});
```

Use the formatter's output if it changes indentation. Do not add fallback
values that turn absent deployment metadata into non-empty strings.

- [ ] **Step 5: Type build constants instead of suppressing errors**

Add these declarations to `global.d.ts`:

```ts
declare const BUILDVAR__BUILD_TIME: number;
declare const BUILDVAR__VERSION: string;
declare const BUILDVAR__BUILD_ENV: "dev" | "preview" | "prod";
declare const BUILDVAR__BRANCH: string | undefined;
declare const BUILDVAR__PULL_REQUEST: string | undefined;
declare const BUILDVAR__GIT_HEAD: string | undefined;
declare const BUILDVAR__GIT_REPO: string | undefined;
declare const BUILDVAR__FEEDBACK_LINK: string | null;
```

Remove the eight `@ts-ignore` comments from `src/data/buildData.ts` and make
`BRANCH` and `GIT_REPO` match the declared optional types:

```ts
export const BRANCH: string | undefined = BUILDVAR__BRANCH;
export const GIT_REPO: string | undefined = BUILDVAR__GIT_REPO;
```

- [ ] **Step 6: Adopt Svelte 5 root mounting and module service workers**

In `src/main.ts`, import and use `mount`:

```ts
import { mount } from "svelte";
import App from "./App.svelte";

const app = mount(App, {
  target: document.body,
});
```

Register the development source directly and the stable production output as
module service workers:

```ts
const serviceWorkerUrl = import.meta.env.DEV
  ? "/src/service-worker.ts"
  : "/service-worker.js";

navigator.serviceWorker.register(serviceWorkerUrl, { type: "module" });
```

Keep the existing feature detection, `load` event, database exposure, onboarding
trigger, and default export.

- [ ] **Step 7: Align service-worker caching with Vite output**

In `src/service-worker.ts`, change the generated asset prefix and icon URL:

```ts
const STATIC_PREFIXES = ["/assets/", "/images/", "/icons/"];
const STATIC_RESOURCES = ["/index.css", "/manifest.webmanifest"];
```

This replaces the obsolete `/build/` browser URL and the incorrect root
`/favicon.png` assumption while preserving the existing Workbox strategies.

- [ ] **Step 8: Run the first Svelte 5 build checkpoint**

Run:

```bash
npm run validate
npm run build
```

Expected: the commands may now identify source-level Svelte 5 and maintained
library entry-point incompatibilities, which are addressed in Task 3. If either
command identifies one of the three protected legacy libraries as the cause,
stop before editing or replacing that library and request the user's decision.

---

### Task 3: Update Maintained Svelte Integrations and Component Types

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/App.svelte`
- Modify: the 17 route/component files importing `svelte-spa-router/Router.svelte`
- Modify: the 18 component files importing `@iconify/svelte/dist/Icon.svelte`
- Modify: `global.d.ts`
- Modify: `src/types/ComponentConstructor.ts`
- Modify: `src/components/SegmentedComponentSelector.svelte`
- Modify or delete: `src/types/svelte-collapsible.d.ts`

**Interfaces:**
- Consumes: Svelte 5's `Component` and `ComponentProps` types, the
  `svelte-spa-router` 5 root export, `@iconify/svelte` 5's root export, and
  `svelte-dnd-action` 0.9's packaged event types.
- Produces: A source tree that passes `svelte-check` without converting
  components to runes.

- [ ] **Step 1: Upgrade maintained Svelte libraries**

Run:

```bash
npm install --save-dev \
  @iconify/svelte@^5.2.2 \
  svelte-dnd-action@^0.9.78 \
  svelte-spa-router@^5.1.1
```

Expected: installation succeeds while the protected legacy library versions
remain unchanged in `package.json` and `package-lock.json`.

- [ ] **Step 2: Normalize router imports**

Use the package root for the router component and all named exports:

```ts
import Router, {
  location,
  pop,
  push,
  querystring,
  replace,
} from "svelte-spa-router";
```

Each file should import only the names it uses. Remove every
`svelte-spa-router/Router.svelte` deep import. Verify with:

```bash
rg 'svelte-spa-router/Router\.svelte' src
```

Expected: no matches.

- [ ] **Step 3: Normalize Iconify imports**

In all 18 matching components, replace:

```ts
import Icon from "@iconify/svelte/dist/Icon.svelte";
```

with:

```ts
import Icon from "@iconify/svelte";
```

Verify with:

```bash
rg '@iconify/svelte/dist/Icon\.svelte' src
```

Expected: no matches.

- [ ] **Step 4: Remove obsolete drag-event augmentation if packaged types suffice**

Temporarily remove the `DndEvent` import and `svelte.JSX` namespace from
`global.d.ts`, then run:

```bash
npm run validate
```

Expected: `src/components/DesignModel/Builder.svelte` accepts `on:consider` and
`on:finalize` through `svelte-dnd-action`'s current types. If those are the only
errors, restore a narrowly scoped Svelte 5-compatible declaration rather than
using the old `svelte.JSX` namespace.

- [ ] **Step 5: Update dynamic component typing only as required**

Replace the class-constructor abstraction in
`src/types/ComponentConstructor.ts` with Svelte 5 component types:

```ts
import type { Component } from "svelte";

export type ComponentConstructor<
  Props extends Record<string, unknown> = Record<string, unknown>,
> = Component<Props>;
```

In `src/components/SegmentedComponentSelector.svelte`, remove the
`SvelteComponent`, `$$Generic`, and `["$$"]["props"]` references. Use:

```ts
type Options = string | number;
type InnerComponentProps = Record<string, unknown>;

export let component: ComponentConstructor<InnerComponentProps>;
export let options: [Options, InnerComponentProps][];
```

If `svelte-check` infers a narrower reusable prop type without a cast, use that
type instead. Do not introduce `any`, `unknown as`, or a rune conversion.

- [ ] **Step 6: Evaluate the collapsible declaration shim**

Run:

```bash
mv src/types/svelte-collapsible.d.ts src/types/svelte-collapsible.d.ts.disabled
npm run validate
```

If validation succeeds, delete the disabled shim. If validation reports only
missing `svelte-collapsible` declarations, restore the file and replace
`SvelteComponentTyped` with the narrowest Svelte 5-compatible component
declarations. If compilation or runtime behavior fails inside
`svelte-collapsible`, restore the original shim, stop, and request user approval
before patching or replacing the library.

- [ ] **Step 7: Clear all Svelte 5 diagnostics**

Run:

```bash
npm run validate
npm run build
```

Expected: both commands exit successfully. Warnings that recommend runes or
new event syntax may remain only when they do not indicate broken behavior;
record them for incremental component migration. Errors must be fixed without
bulk component conversion.

- [ ] **Step 8: Commit the toolchain and compatibility migration**

```bash
git add \
  package.json package-lock.json svelte.config.js tsconfig.json \
  vite.config.ts index.html public/index.html rollup.config.js \
  src/main.ts src/service-worker.ts src/data/buildData.ts global.d.ts \
  src/App.svelte src/components src/routes src/types
git commit -m "build: upgrade app to Svelte 5 and Vite"
```

---

### Task 4: Verify Build Outputs and Development Serving

**Files:**
- Modify if required: `vite.config.ts`
- Modify if required: `src/main.ts`
- Modify if required: `src/service-worker.ts`
- Generated and untracked: `build/`

**Interfaces:**
- Consumes: The Vite configuration and app produced by Tasks 2 and 3.
- Produces: Verified production and development artifacts at the URLs required
  by the app, manifest, service-worker registration, and Netlify.

- [ ] **Step 1: Verify a clean lockfile installation**

Run:

```bash
rm -rf node_modules
npm ci
```

Expected: installation succeeds on Node.js 22.12+ without peer-dependency
errors.

- [ ] **Step 2: Verify static analysis and production compilation**

Run:

```bash
npm run validate
rm -rf build
npm run build
```

Expected: both commands exit successfully and `build/` is recreated.

- [ ] **Step 3: Inspect required production artifacts**

Run:

```bash
test -f build/index.html
test -f build/service-worker.js
test -f build/index.css
test -f build/manifest.webmanifest
test -f build/icons/favicon.png
test -f build/icons/precomp-icon-192.png
find build/assets -type f -maxdepth 1 | sort
```

Expected: every `test` succeeds and `build/assets/` contains hashed JavaScript
and CSS application files.

- [ ] **Step 4: Smoke-test the development server**

Run the server in a visible terminal:

```bash
npm run dev -- --host 127.0.0.1
```

From another terminal, run:

```bash
curl --fail --silent http://127.0.0.1:5173/ >/dev/null
curl --fail --silent http://127.0.0.1:5173/index.css >/dev/null
curl --fail --silent http://127.0.0.1:5173/manifest.webmanifest >/dev/null
curl --fail --silent http://127.0.0.1:5173/icons/favicon.png >/dev/null
curl --fail --silent http://127.0.0.1:5173/src/service-worker.ts >/dev/null
```

Expected: every request returns HTTP 200. Stop the server with Ctrl-C after the
checks.

- [ ] **Step 5: Smoke-test the production preview**

Run:

```bash
npm run start -- --host 127.0.0.1
```

From another terminal, run:

```bash
curl --fail --silent http://127.0.0.1:4173/ >/dev/null
curl --fail --silent http://127.0.0.1:4173/service-worker.js >/dev/null
curl --fail --silent http://127.0.0.1:4173/icons/favicon.png >/dev/null
```

Expected: every request returns HTTP 200. Stop the preview server with Ctrl-C.

- [ ] **Step 6: Commit any verification-driven corrections**

If the checks required source or configuration corrections:

```bash
git add vite.config.ts src/main.ts src/service-worker.ts
git commit -m "fix: preserve Vite deployment assets"
```

If no tracked files changed, do not create an empty commit.

---

### Task 5: Run Collaborative Manual End-to-End Verification

**Files:**
- Modify if a verified regression requires it: the narrowest affected source
  file.
- Do not modify protected legacy libraries without user approval.

**Interfaces:**
- Consumes: A running Vite development server and the user's browser.
- Produces: User-confirmed behavior for navigation, the protected legacy UI
  libraries, maintained Svelte integrations, and PWA registration.

- [ ] **Step 1: Start the app for collaborative testing**

Run in a visible terminal:

```bash
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` and keep the terminal visible for runtime errors.

- [ ] **Step 2: Ask the user to verify core navigation and persistence**

Have the user confirm these scenarios:

```text
1. Load the home page and navigate to Projects, About, Settings, and back.
2. Create or open a project and confirm its detail page renders.
3. Reload a nested route and confirm the application returns to that route.
4. Confirm existing local project data is still present.
```

Expected: routes render without blank pages, console exceptions, or data loss.

- [ ] **Step 3: Ask the user to verify protected legacy UI libraries**

Have the user confirm:

```text
1. Open Reflection Questions and expand/collapse multiple accordion sections.
2. Open Onboarding or Tutorials and move forward and backward through a carousel.
3. Open About this Project and confirm profile cards retain the masonry layout.
```

Expected: accordion, carousel, and masonry behavior matches the pre-upgrade app.
If a failure is attributable to a protected library, stop and present the
specific patch/replacement options before changing dependencies.

- [ ] **Step 4: Ask the user to verify maintained integrations**

Have the user confirm:

```text
1. Open the design model builder and drag an activity to a new position.
2. Confirm icons render on navigation, buttons, timers, menus, and activity rows.
3. Exercise browser back/forward navigation through several app routes.
```

Expected: drag-and-drop state updates, icons render, and router history remains
correct.

- [ ] **Step 5: Ask the user to verify PWA behavior**

In browser developer tools, have the user confirm:

```text
1. The manifest loads without an error.
2. A module service worker registers from /src/service-worker.ts in development.
3. No failed /build/bundle.js or /build/bundle.css requests remain.
```

Then run the production preview and confirm `/service-worker.js` registers there.

- [ ] **Step 6: Fix only confirmed regressions and repeat their scenarios**

For each confirmed regression:

```text
1. Capture the browser console error and exact reproduction steps.
2. Identify whether the cause is app code, Vite configuration, a maintained
   integration, or a protected legacy library.
3. Apply the smallest fix allowed by the global constraints.
4. Run npm run validate and npm run build.
5. Ask the user to repeat only the affected manual scenario.
```

Expected: every reported regression is either fixed and re-verified or paused
for an explicit protected-library decision.

- [ ] **Step 7: Commit verified regression fixes**

```bash
git add -u
git commit -m "fix: preserve behavior after Svelte 5 upgrade"
```

Inspect `git status --short` before staging so `git add -u` contains only the
tracked files changed for confirmed regressions. Do not create this commit when
no regression fix was needed.

---

### Task 6: Record Deferred Dependency Upgrades and Final Evidence

**Files:**
- No repository files unless a final compatibility correction is required.

**Interfaces:**
- Consumes: The completed migration and current npm dependency graph.
- Produces: A final handoff listing deferred direct dependencies and concrete
  verification evidence.

- [ ] **Step 1: Inventory out-of-scope direct dependency updates**

Run:

```bash
npm outdated --depth=0
```

Expected: the output identifies direct dependencies that remain behind current
stable releases. Exclude packages intentionally upgraded in this migration and
record the remaining package, current version, and latest version in the final
handoff.

- [ ] **Step 2: Run final technical verification**

Run:

```bash
npm ci
npm run validate
npm run build
git status --short
```

Expected: installation, checking, and production compilation succeed. The
working tree contains no unexpected files; generated `build/` output is either
ignored or intentionally absent from version control.

- [ ] **Step 3: Review the complete branch diff**

Run:

```bash
git --no-pager diff main...HEAD --check
git --no-pager diff main...HEAD --stat
git --no-pager log --oneline main..HEAD
```

Expected: no whitespace errors, and the diff is limited to the approved design,
Node baseline, Vite/Svelte migration, compatibility fixes, and verified
regression fixes.

- [ ] **Step 4: Prepare the final handoff**

Report:

```text
- Exact Svelte, Vite, TypeScript, router, drag-and-drop, and Iconify versions.
- Successful npm ci, svelte-check, and production build results.
- User-confirmed manual scenarios.
- Any remaining non-blocking legacy-mode warnings.
- Deferred outdated direct dependencies from npm outdated --depth=0.
- Any protected legacy library that required an approved exception.
```
