const config = {
  development: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
    logging: false,
  },
  test: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
    logging: false,
  },
  production: {
    dialect: "postgres",
    use_env_variable: "DATABASE_URL",
    logging: false,
  },
};

export default config;
