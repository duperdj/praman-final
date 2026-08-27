// Local Postgres for development — a real Postgres server (no Docker) via
// embedded-postgres. Run this in its own terminal and leave it open while you
// `npm run dev`. Data persists in ./.pgdata. Nothing here ships to production —
// the deploy uses Neon through Vercel's env vars.
import EmbeddedPostgres from "embedded-postgres";
import pg from "pg";
import { existsSync } from "node:fs";

const dataDir = "./.pgdata";
const server = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

if (!existsSync(dataDir)) {
  console.log("Initialising local Postgres data directory…");
  await server.initialise();
}
await server.start();

// Create the app database as UTF8 (the cluster defaults to the Windows locale,
// which can't store Hindi text) — idempotent.
const admin = new pg.Client({ host: "localhost", port: 5432, user: "postgres", password: "postgres", database: "postgres" });
await admin.connect();
const { rowCount } = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'praman'");
if (!rowCount) {
  await admin.query("CREATE DATABASE praman WITH ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0");
  console.log("Created database 'praman' (UTF8).");
} else {
  console.log("Database 'praman' already exists.");
}
await admin.end();

console.log("Local Postgres is running on localhost:5432 (database: praman). Leave this terminal open.");

const stop = async () => { try { await server.stop(); } catch { /* ignore */ } process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
