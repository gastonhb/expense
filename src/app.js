const config = require('./config/environment');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes/index.js');
const morganMiddleware = require('./config/morgan');
const logger = require('./config/logger');
const { globalErrorHandler } = require('./middlewares/errorHandler');
const { specs, swaggerUi, swaggerUiOptions } = require('./config/swagger');
const { aggressiveLimiter } = require('./middlewares/rateLimiter');
const { HTTP_STATUS } = require('./utils/constants');

const ApiError = require('./controllers/ApiError.js');

const app = express();

// Trust proxy (para rate limiting y logs correctos)
app.set('trust proxy', 1);

// Logger de HTTP requests
app.use(morganMiddleware);

// Rate limiter agresivo para prevenir ataques
app.use(aggressiveLimiter);

// CORS
app.use(cors());

// Seguridad
app.use(helmet());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentación API con Swagger
if (config.swagger.enabled) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  logger.info(`📚 Documentación API disponible en: ${config.url}:${config.port}/api-docs`);
}

// Rutas principales
app.use('/v1', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Template - Node.js, Express, Sequelize y PostgreSQL',
    version: '1.0.0',
    environment: config.env,
    documentation: config.swagger.enabled ? `${config.url}/api-docs` : null,
    timestamp: new Date().toISOString()
  });
});

// Manejar favicon.ico (evitar 404 en logs)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Not found handler - versión compatible con Express 5
app.use((req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Ruta ${req.originalUrl} no encontrada`));
});

// Error handler global
app.use(globalErrorHandler);

module.exports = app;
