const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Faltan variables de entorno obligatorias: ${missing.join(', ')}. Revisa tu archivo .env`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 3000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  db: {
    host: process.env.DB_HOST,
    port: toInt(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    logging: process.env.DB_LOGGING === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  bcryptSaltRounds: toInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  authRateLimit: {
    windowMs: toInt(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES, 15) * 60 * 1000,
    max: toInt(process.env.AUTH_RATE_LIMIT_MAX, 100),
  },
};
