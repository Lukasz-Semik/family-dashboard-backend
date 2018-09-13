const config = require('./config/config');

module.exports = {
  type: config.DB_TYPE,
  host: config.DB_HOST,
  port: config.DB_PORT,
  url: config.DB_URL,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['build/entity/*.js'],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};
