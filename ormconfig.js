const config = require('./config/config');

let configOptions = {
  type: config.DB_TYPE,
  host: config.DB_HOST,
  port: config.DB_PORT,
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

if (config.NODE_ENV === 'production') {
  const parse = require('pg-connection-string').parse;
  const config = parse(config.DATABASE_URL);

  configOptions = {
    type: config.DB_TYPE,
    host: config.host,
    port: config.port || config.DB_PORT,
    username: config.user || config.DB_USERNAME,
    password: config.password || config.DB_PASSWORD,
    database: config.database || config.DB_NAME,
  };
}

module.exports = configOptions;
