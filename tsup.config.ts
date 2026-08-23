import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/all.ts",
    "src/markdown.ts",
    "src/engines/handlebars.ts",
    "src/engines/mustache.ts",
    "src/engines/liquid.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  // Shared chunks matter here: the engine registry is module state, so core
  // and /all must resolve to the same instance rather than inlined copies.
  splitting: true,
  treeshake: true,
  clean: true,
  sourcemap: true,
})
