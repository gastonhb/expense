const Joi = require('joi');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number()
    .port()
    .default(3000),

  URL: Joi.string()
    .uri()
    .default('http://localhost'),

  // Database configuration
  DATABASE_URL: Joi.string()
    .uri()
    .optional(),

  DB_DIALECT: Joi.string()
    .valid('postgres', 'mysql', 'mariadb', 'sqlite', 'mssql')
    .default('postgres'),

  DB_HOST: Joi.string()
    .default('localhost'),

  DB_PORT: Joi.number()
    .port()
    .default(5432),

  DB_NAME: Joi.string()
    .default('api_template'),

  DB_USER: Joi.string()
    .default('postgres'),

  DB_PASSWORD: Joi.string()
    .default('postgres'),

  DB_SCHEMA: Joi.string()
    .allow('')
    .default('public'),

  DB_SSL: Joi.boolean()
    .default(false),

  DB_SYNC: Joi.boolean()
    .default(true),

  DB_LOGGING: Joi.boolean()
    .default(false),

  // Firebase Auth configuration
  FIREBASE_PROJECT_ID: Joi.string()
    .optional(),

  FIREBASE_CLIENT_EMAIL: Joi.string()
    .email()
    .optional(),

  FIREBASE_PRIVATE_KEY: Joi.string()
    .optional(),

  FIREBASE_SERVICE_ACCOUNT_JSON: Joi.string()
    .optional(),

  // Pagination configuration
  PAGINATION_DEFAULT_PAGE_SIZE: Joi.number()
    .integer()
    .min(1)
    .default(20),

  PAGINATION_PAGE_ATTR: Joi.string()
    .default('_page'),

  PAGINATION_LIMIT_ATTR: Joi.string()
    .default('_limit'),

  PAGINATION_ORDER_ATTR: Joi.string()
    .default('_order'),

  // Logging configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'debug')
    .default('info'),

  SWAGGER_ENABLED: Joi.boolean()
    .default(false),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Joi.number()
    .default(15 * 60 * 1000), // 15 minutos

  RATE_LIMIT_MAX_REQUESTS: Joi.number()
    .default(100)

}).unknown(true);

const { error, value: env } = envSchema.validate(process.env, {
  errors: { label: 'key' }
});

if (error) {
  throw new Error(`❌ Config validation error: ${error.message}`);
}

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  url: env.URL,

  // Database configuration
  database: {
    url: env.DATABASE_URL,
    dialect: env.DB_DIALECT,
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    schema: env.DB_SCHEMA || undefined,
    ssl: env.DB_SSL,
    sync: env.DB_SYNC,
    logging: env.DB_LOGGING
  },

  // Firebase Auth configuration
  firebase: {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
    serviceAccountJson: env.FIREBASE_SERVICE_ACCOUNT_JSON
  },

  // Pagination configuration
  pagination: {
    defaultPageSize: env.PAGINATION_DEFAULT_PAGE_SIZE,
    pageAttr: env.PAGINATION_PAGE_ATTR,
    limitAttr: env.PAGINATION_LIMIT_ATTR,
    orderAttr: env.PAGINATION_ORDER_ATTR
  },

  // Logging configuration
  logging: {
    level: env.LOG_LEVEL
  },

  swagger: {
    enabled: env.SWAGGER_ENABLED || env.NODE_ENV === 'development'
  },

  // Rate limiting configuration
  rateLimiting: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS
  }
};

module.exports = config;
