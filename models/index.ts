import { readdirSync } from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    dialect: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    logging: false,
    port: Number(process.env.DB_PORT),
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const models: { [key: string]: any } = {};

export async function initializeModels() {
  const files = readdirSync(__dirname).filter((file) => {
    const ext = path.extname(file);
    return file.endsWith(ext) && file !== `index${ext}`;
  });

  const modelDefs = await Promise.all(
    files.map(async (file) => {
      const modelModule = await import(path.join(__dirname, file));
      return modelModule.default(sequelize);
    })
  );

  for (const model of modelDefs) {
    models[model.name] = model;
  }

  for (const modelName of Object.keys(models)) {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  }

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  return models;
}
