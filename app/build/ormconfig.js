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
    const connectionOptions = parse(config.DATABASE_URL);
    configOptions = {
        type: connectionOptions.DB_TYPE,
        host: connectionOptions.host,
        port: connectionOptions.port,
        username: connectionOptions.user,
        password: connectionOptions.password,
        database: connectionOptions.database,
        entities: ['build/entity/*.js'],
    };
}
console.log('config options', configOptions);
module.exports = configOptions;
//# sourceMappingURL=ormconfig.js.map