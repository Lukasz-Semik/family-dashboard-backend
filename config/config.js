const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: envPath });

const REQUIRED_KEYS = [
  'DB_TYPE',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'NODE_PORT',
];

REQUIRED_KEYS.forEach(key => {
  if (!(key in process.env)) {
    throw new Error(`Missing required config key: ${key}`);
  }
});

const { DB_TYPE, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_PORT } = process.env;

module.exports = {
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  NODE_PORT,
};
