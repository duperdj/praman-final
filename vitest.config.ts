import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Engine/SLA unit tests (Vitest). Pure-function suites live next to the code in
// lib/engine and lib/sla (Lane A, later waves). passWithNoTests keeps the
// foundation green before any suites exist.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "tests/**/*.test.ts"],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
