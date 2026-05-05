const morgan = require('morgan');
const config = require('./environment');
const logger = require('./logger');

// Crear un stream object con un método 'write' que usará el logger
const stream = {
  write: (message) => logger.http(message.trim())
};

// Función para saltar logs en modo test
const skip = () => {
  const env = config.env || 'development';
  return env === 'test';
};

// Configuración de Morgan
const morganMiddleware = morgan(
  // Formato de log personalizado
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip
  }
);

module.exports = morganMiddleware;
