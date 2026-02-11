import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pg;

async function ensureDatabase() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

  const DATABASE_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

  if (!DATABASE_URL || !DB_NAME) {
    console.error("❌ DATABASE_URL or DB_NAME missing from .env");
    process.exit(1);
  }

  const adminUrl = DATABASE_URL.replace(/\/[^\/]+$/, "/postgres");

  const client = new Client({
    connectionString: adminUrl,
  });

  try {
    await client.connect();

    const exists = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}';`,
    );

    if (exists.rowCount === 0) {
      console.log(`🆕 Database '${DB_NAME}' not found — creating...`);
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Database '${DB_NAME}' created.`);
    } else {
      console.log(`👌 Database '${DB_NAME}' already exists.`);
    }
  } catch (err) {
    console.error("❌ Failed to ensure database exists:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

ensureDatabase();
