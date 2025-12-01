/* eslint-disable no-undef */
import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER ?? "myuser",
    password: process.env.DB_PASS ?? "mypassword",
    database: process.env.DB_NAME ?? "seamless-demo",
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT || "5432",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "test_db",
    port: process.env.DB_PORT || "5432",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    dialect: "postgres",
    username: process.env.DB_USER ?? "myuser",
    password: process.env.DB_PASS ?? "mypassword",
    port: process.env.DB_PORT || "5432",
    database: process.env.DB_NAME ?? "seamless-demo",
    host: process.env.DB_HOST ?? "localhost",
  },
};

export default config;
