// scripts/runMigrations.js
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

execSync("node ./scripts/ensureDatabase.js", { stdio: "inherit" });

// Use compiled migrations in production, source in dev
const isProd = process.env.NODE_ENV === "production";
const configPath = isProd
  ? path.join(__dirname, "../dist/config/config.js")
  : path.join(__dirname, "../config/config.js");

try {
  console.log("📦 Running database migrations...");
  execSync(`npx sequelize-cli db:migrate --config ${configPath}`, {
    stdio: "inherit",
  });
  console.log("✅ Database migrations complete.");
} catch (err) {
  console.error("❌ Failed to run migrations", err);
  process.exit(1);
}
