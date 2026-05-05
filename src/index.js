try {
  const app = require('./app.js');
  const config = require('./config/environment');
  const logger = require('./config/logger');
  const Database = require('./config/database');

  let server;

  // Conectar a base de datos con timeout
  const connectWithTimeout = () => {
    return Promise.race([
      Database.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout de conexión a base de datos')), 10000)
      )
    ]);
  };

  connectWithTimeout()
    .then(() => {
      logger.info('🚀 Iniciando servidor HTTP...');
      server = app.listen(config.port, () => {
        logger.info(`✅ Servidor ejecutándose en ${config.url}:${config.port}`);
        logger.info(`🌍 Entorno: ${config.env}`);
        if (config.env === 'development') {
          logger.info(`📚 Documentación: ${config.url}:${config.port}/api-docs`);
        }
      });
    })
    .catch(err => {
      logger.error('❌ Error al inicializar la aplicación:', err);
      process.exit(1);
    });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('🔴 Servidor HTTP cerrado');
        Database.disconnect().then(() => {
          logger.info('💀 Proceso terminado');
          process.exit(0);
        });
      });
    } else {
      Database.disconnect().then(() => {
        process.exit(0);
      });
    }
  };

  const errorHandler = (error, source = 'unknown') => {
    logger.error(`❌ Error no controlado desde ${source}:`, {
      error: error.message,
      stack: error.stack,
      source,
      timestamp: new Date().toISOString()
    });
    exitHandler();
  };

  process.on('uncaughtException', (error) => errorHandler(error, 'uncaughtException'));
  process.on('unhandledRejection', (error) => errorHandler(error, 'unhandledRejection'));

  process.on('SIGTERM', () => {
    logger.info('📶 SIGTERM recibido - Iniciando cierre graceful');
    exitHandler();
  });

  process.on('SIGINT', () => {
    logger.info('📶 SIGINT recibido - Iniciando cierre graceful');
    exitHandler();
  });

} catch (error) {
  const logger = require('./config/logger');
  logger.error('❌ Error crítico al iniciar el servidor:', error);
  process.exit(1);
}
