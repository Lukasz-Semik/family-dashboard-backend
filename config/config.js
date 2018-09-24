const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({ path: envPath });

const {
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DATABASE_URL,
  NODE_PORT,
  NODE_ENV,
  JWT_TOKEN,
  SENDGRID_API_KEY,
} = process.env;

if (NODE_ENV !== 'production') {
  const REQUIRED_KEYS = [
    'DB_TYPE',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'NODE_PORT',
    'JWT_TOKEN',
  ];

  REQUIRED_KEYS.forEach(key => {
    if (!(key in process.env)) {
      throw new Error(`Missing required config key: ${key}`);
    }
  });
}

if (NODE_ENV === 'production' || NODE_ENV === 'development') {
  if (!(SENDGRID_API_KEY in process.env)) {
    throw new Error(`Missing required config key: ${SENDGRID_API_KEY}`);
  }
}

if (NODE_ENV === 'production') {
  const REQUIRED_KEYS = ['DATABASE_URL', 'JWT_TOKEN'];

  REQUIRED_KEYS.forEach(key => {
    if (!(key in process.env)) {
      throw new Error(`Missing required config key: ${key}`);
    }
  });
}

module.exports = {
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  NODE_PORT,
  NODE_ENV,
  DATABASE_URL,
  JWT_TOKEN,
  SENDGRID_API_KEY,
};
