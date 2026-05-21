const app = require('../src/app');
const Database = require('../src/config/database');
const logger = require('../src/config/logger');

let connectionPromise = null;

async function ensureDatabaseConnection() {
  if (!connectionPromise) {
    connectionPromise = Database.connect().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDatabaseConnection();
    return app(req, res);
  } catch (error) {
    logger.error('Error inicializando funcion en Vercel', {
      error: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      status: 'error',
      message: 'Error inicializando la aplicacion',
      timestamp: new Date().toISOString()
    });
  }
};
