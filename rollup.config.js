import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import preprocess from "svelte-preprocess";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import ts from "typescript";
import copy from "rollup-plugin-copy";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;

const ENV = !production ? "dev" : process.env.PULL_REQUEST ? "preview" : "prod";

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default [
  {
    input: "src/main.ts",
    output: {
      file: "build/build/bundle.js",
      format: "iife",
      name: "app",
      sourcemap: !production,
    },
    plugins: [
      svelte({
        preprocess: preprocess({
          moduleResolution: ts.ModuleKind.ESNext,
        }),

        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production,
          // we'll extract any component CSS out into
          // a separate file - better for performance
          css: false,
        },
      }),

      css({ output: "bundle.css" }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      replace({
        BUILDVAR__BUILD_TIME: JSON.stringify(Date.now()),
        BUILDVAR__VERSION: JSON.stringify(process.env.npm_package_version),
        BUILDVAR__BUILD_ENV: JSON.stringify(ENV),
        BUILDVAR__BRANCH: JSON.stringify(process.env.BRANCH),
        BUILDVAR__PULL_REQUEST: JSON.stringify(process.env.REVIEW_ID),
        BUILDVAR__GIT_HEAD: JSON.stringify(process.env.HEAD),
        BUILDVAR__GIT_REPO: JSON.stringify(process.env.REPOSITORY_URL),
        preventAssignment: true,
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload({ watch: "build" }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),

      copy({
        targets: [
          { src: "public/*", dest: "build/" },
          { src: `icons/icons-${ENV}/*`, dest: "build/icons" },
        ],
      }),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/service-worker.ts",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "workbox",
      file: "build/service-worker.js",
    },
    plugins: [
      resolve(),
      replace({
        "process.env.NODE_ENV": production ? "'production'" : "'development'",
        preventAssignment: true,
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),
      production && terser(),
    ],
  },
];
