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
            rename: { stripBase: true },
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
