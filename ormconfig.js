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
  entities: config.NODE_ENV === 'test' ? ['build/src/entity/*.js'] : ['src/entity/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
};

if (config.NODE_ENV === 'production') {
  const parse = require('pg-connection-string').parse;
  const connectionOptions = parse(config.DATABASE_URL);

  configOptions = {
    type: 'postgres',
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    synchronize: true,
    entities: ['build/src/entity/*.js'],
    cli: {
      entitiesDir: 'build/src/entity',
      migrationsDir: 'src/migration',
    },
  };
}

module.exports = configOptions;
