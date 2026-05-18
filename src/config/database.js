const { Sequelize } = require('sequelize');
const logger = require('./logger');
const config = require('./environment');

class Database {
  static connection = null;

  static getDefineOptions() {
    const define = {
      timestamps: true
    };

    if (config.database.schema) {
      define.schema = config.database.schema;
    }

    return define;
  }

  static getDialectOptions() {
    if (!config.database.ssl) {
      return {};
    }

    if (config.database.dialect === 'postgres') {
      return {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      };
    }

    return {};
  }

  static sequelize = config.database.url
    ? new Sequelize(config.database.url, {
      dialect: config.database.dialect,
      logging: config.database.logging ? (msg) => logger.debug(msg) : false,
      dialectOptions: Database.getDialectOptions(),
      define: Database.getDefineOptions()
    })
    : new Sequelize(config.database.name, config.database.user, config.database.password, {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      logging: config.database.logging ? (msg) => logger.debug(msg) : false,
      dialectOptions: Database.getDialectOptions(),
      define: Database.getDefineOptions()
    });

  /**
   * Conectar a la base de datos
   */
  static async connect() {
    try {
      if (Database.connection) {
        logger.info('Usando conexion existente a base de datos');
        return Database.connection;
      }

      await Database.sequelize.authenticate();

      if (config.database.sync) {
        await Database.sequelize.sync();
      }

      Database.connection = Database.sequelize;

      logger.info('Base de datos conectada exitosamente', {
        dialect: config.database.dialect,
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        schema: config.database.schema || null,
        synchronized: config.database.sync
      });

      return Database.connection;
    } catch (error) {
      logger.error('Error al conectar base de datos', {
        error: error.message,
        stack: error.stack,
        dialect: config.database.dialect,
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        schema: config.database.schema || null
      });

      if (config.env === 'development') {
        logger.error('Detalles de error de conexion de base de datos:', error);
      }

      process.exit(1);
    }
  }

  /**
   * Desconectar de la base de datos
   */
  static async disconnect() {
    try {
      if (Database.connection) {
        await Database.sequelize.close();
        Database.connection = null;
        logger.info('Base de datos desconectada exitosamente');
      }
    } catch (error) {
      logger.error('Error al desconectar base de datos:', error);
    }
  }

  /**
   * Cierre graceful de la conexión
   */
  static gracefulShutdown = async (signal) => {
    logger.info(`Senal ${signal} recibida. Cerrando servidor HTTP...`);

    try {
      await Database.disconnect();
      logger.info('Proceso terminado exitosamente');
      process.exit(0);
    } catch (error) {
      logger.error('Error durante el cierre graceful:', error);
      process.exit(1);
    }
  };

  /**
   * Obtener estadísticas de la conexión
   */
  static getConnectionStats() {
    if (!Database.connection) {
      return null;
    }

    const sequelizeConfig = Database.sequelize.config;
    return {
      host: sequelizeConfig.host,
      port: sequelizeConfig.port,
      name: sequelizeConfig.database,
      schema: config.database.schema || null,
      dialect: Database.sequelize.getDialect(),
      models: Database.sequelize.modelManager.models.map((model) => model.name)
    };
  }

  /**
   * Verificar salud de la conexión
   */
  static async healthCheck() {
    try {
      if (!Database.connection) {
        return { status: 'disconnected', details: 'No hay conexión activa' };
      }

      await Database.sequelize.query('SELECT 1 AS health');

      const stats = Database.getConnectionStats();

      return {
        status: 'healthy',
        details: {
          host: stats.host,
          port: stats.port,
          database: stats.name,
          schema: stats.schema,
          dialect: stats.dialect,
          modelsCount: stats.models.length
        }
      };

    } catch (error) {
      logger.error('Health check falló:', error);
      return {
        status: 'unhealthy',
        details: error.message
      };
    }
  }

  static getSequelize() {
    return Database.sequelize;
  }
}

module.exports = Database;
