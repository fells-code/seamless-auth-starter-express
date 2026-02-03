import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pg;

async function ensureDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  const dbName = process.env.DB_NAME;

  if (!databaseUrl || !dbName) {
    console.error("❌ DATABASE_URL or DB_NAME missing from .env");
    process.exit(1);
  }

  const adminUrl = databaseUrl.replace(/\/[^\/]+$/, "/postgres");

  const client = new Client({
    connectionString: adminUrl,
  });

  try {
    await client.connect();

    const exists = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}';`,
    );

    if (exists.rowCount === 0) {
      console.log(`🆕 Database '${dbName}' not found — creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created.`);
    } else {
      console.log(`👌 Database '${dbName}' already exists.`);
    }
  } catch (err) {
    console.error("❌ Failed to ensure database exists:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

ensureDatabase();
