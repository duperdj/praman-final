// Build-time seed guard. Seeds the 45 demo applications ONLY when the database
// is empty, so the first deploy populates it but later redeploys never wipe
// real submissions. Runs after `prisma migrate deploy` in the Vercel build.
import { PrismaClient } from "@prisma/client";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();
const here = dirname(fileURLToPath(import.meta.url));

try {
  const count = await prisma.application.count();
  if (count > 0) {
    console.log(`🌱 seed-if-empty: ${count} applications already present — skipping seed.`);
  } else {
    console.log("🌱 seed-if-empty: empty database — running seed…");
    await prisma.$disconnect();
    execFileSync(process.execPath, [join(here, "seed.mjs")], { stdio: "inherit" });
    process.exit(0);
  }
} catch (e) {
  // Never fail the build on a seed hiccup — the app still deploys.
  console.warn("⚠ seed-if-empty skipped:", e?.message ?? e);
} finally {
  await prisma.$disconnect().catch(() => {});
}
