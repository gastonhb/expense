const winston = require('winston');
const config = require('./environment');

// Definir niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Definir colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Configurar colores en Winston
winston.addColors(colors);

// Formato para desarrollo
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato para producción
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Función para determinar el nivel de log basado en el entorno
const level = () => {
  const env = config.env || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Función para determinar los transports basado en el entorno
const transports = () => {
  const env = config.env || 'development';
  const isDevelopment = env === 'development';
  const isServerless = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  const commonTransports = [];

  // En entornos serverless no se debe escribir a disco local.
  if (!isServerless) {
    commonTransports.push(
      // Archivo para errores
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: prodFormat
      }),
      // Archivo para todos los logs
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: prodFormat
      })
    );
  }

  // En desarrollo, agregar console con colores
  if (isDevelopment) {
    commonTransports.push(
      new winston.transports.Console({
        format: devFormat
      })
    );
  } else {
    // En producción, console sin colores
    commonTransports.push(
      new winston.transports.Console({
        format: prodFormat
      })
    );
  }

  return commonTransports;
};

// Crear el logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: prodFormat,
  transports: transports(),
  // No salir en errores no manejados
  exitOnError: false
});

module.exports = logger;
