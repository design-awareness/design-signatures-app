# Svelte 5 Upgrade Design

## Goal

Upgrade the application from Svelte 3 to Svelte 5 without converting existing
components to runes. Modernize the build from Rollup to Vite, preserve current
runtime and deployment behavior, and limit dependency changes to the Svelte
toolchain and Svelte-integrated libraries.

The supported development and CI runtime will be Node.js 22, with a minimum
minor version that satisfies the selected Vite release.

## Upgrade Strategy

Perform a direct migration to Svelte 5 and Vite rather than using Svelte 4 as an
intermediate step. Svelte 5's legacy mode will continue to support existing
component syntax, including `export let`, lifecycle APIs,
`createEventDispatcher`, and `<svelte:component>`.

The application entry point will use Svelte 5's `mount` API instead of
constructing the root component with `new App(...)`. Other component changes
will be limited to compatibility fixes that are required by the upgraded
compiler or types.

## Build Architecture

Vite and `@sveltejs/vite-plugin-svelte` will replace Rollup and its plugins.
The Vite configuration must preserve each responsibility of the current build:

- SCSS preprocessing in Svelte components.
- Development server behavior and production minification.
- Source maps in non-production builds.
- A production output directory of `build/` for Netlify.
- Static files currently stored under `public/`.
- Environment-specific icons selected from `icons/icons-dev`,
  `icons/icons-preview`, or `icons/icons-prod`.
- A separately emitted service worker at `/service-worker.js`.
- Existing build metadata values: build time, package version, environment,
  branch, pull request, Git head, repository URL, and feedback URL.

The root HTML document will become Vite's entry document and load the
TypeScript application entry as a module. Existing manifest, icon, stylesheet,
and service-worker URLs must remain stable.

Build-time environment classification remains `dev`, `preview`, or `prod`.
Missing optional deployment metadata will retain its existing `undefined` or
`null` semantics. Configuration failures will be surfaced rather than replaced
with success-shaped defaults.

## Dependency Scope

Upgrade the framework-coupled toolchain together:

- Svelte 5 on the current stable 5.x line.
- Vite and `@sveltejs/vite-plugin-svelte`.
- `svelte-check`.
- TypeScript on a stable 5.x release compatible with the Svelte tooling.
- `@tsconfig/svelte`.
- Sass.

Remove Rollup, its plugins, the Rollup-specific minifier and copy plugins,
`svelte-preprocess`, and the standalone development server when Vite replaces
their responsibilities.

Upgrade maintained Svelte integrations that explicitly support Svelte 5:

- `svelte-spa-router`.
- `svelte-dnd-action`.
- `@iconify/svelte`.

Do not broadly upgrade unrelated direct dependencies. Record materially
outdated dependencies discovered during implementation so they can be handled
separately.

## Legacy Library Compatibility

Initially retain these older libraries unchanged:

- `svelte-collapsible`.
- `svelte-snappy-carousel`.
- The GitHub-sourced masonry package.

Validate each library through dependency installation, compilation, type
checking, and runtime smoke testing. If any library is incompatible, stop and
present the specific failure and the available patch or replacement options
before replacing it.

Prefer clean upstream types and maintained APIs over existing local declaration
shims or dependency-era workarounds. Remove a shim or workaround when the
upgraded dependency makes it unnecessary. Minimal local Svelte 5 type updates
are acceptable when an upstream library still lacks usable types.

## Validation

The migration is complete when all of the following succeed on the Node.js 22
baseline:

1. A clean dependency installation from the lockfile.
2. `svelte-check` with no errors.
3. A production Vite build.
4. A development-server smoke check that confirms the application starts.
5. Checks that the root page, static assets, environment-specific icons,
   manifest, and generated service worker are emitted and served at their
   expected URLs.
6. Collaborative manual end-to-end testing of affected user flows. The
   implementation will identify specific components and features that need
   verification, and the user will exercise those scenarios in the running
   application.

The repository currently has no automated test suite. This migration will not
introduce a test framework solely for the toolchain change.

## Out of Scope

- Converting components to runes.
- Redesigning application behavior or UI.
- Broad dependency modernization unrelated to Svelte or the build.
- Replacing an incompatible legacy UI library without explicit approval.
