const logger = require('../config/logger');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleCastErrorDB = (err) => {
  const message = `Recurso inválido: ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valor duplicado: ${value}. Por favor usa otro valor!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Datos de entrada inválidos. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token inválido. Por favor inicia sesión de nuevo!', 401);

const handleJWTExpiredError = () =>
  new AppError('Tu token ha expirado! Por favor inicia sesión de nuevo.', 401);

const clientMessage = (err) => {
  if (err.statusCode === 404) {
    return 'Recurso no encontrado';
  }
  return err.message;
};

const sendErrorDev = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  // API
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/v1')) {
    const response = {
      status: err.status || 'error',
      statusCode: statusCode,
      message: clientMessage(err),
      timestamp: new Date().toISOString()
    };

    // Incluir detalles de validación si existen
    if (err.details) {
      response.errors = err.details;
    } else {
      response.stack = err.stack;
    }

    return res.status(statusCode).json(response);
  }

  // Para cualquier ruta (ya que es una API REST)
  logger.error('ERROR', err);
  const response = {
    status: err.status || 'error',
    statusCode: statusCode,
    message: clientMessage(err),
    timestamp: new Date().toISOString()
  };

  if (err.details) {
    response.errors = err.details;
  } else {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

const sendErrorProd = (err, req, res) => {
  const statusCode = err.statusCode || 500;

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const response = {
      status: err.status || 'error',
      statusCode: statusCode,
      message: clientMessage(err),
      timestamp: new Date().toISOString()
    };

    // Incluir detalles de validación si existen
    if (err.details) {
      response.errors = err.details;
    }

    return res.status(statusCode).json(response);
  }

  // Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error('ERROR', err);
  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Algo salió mal!',
    timestamp: new Date().toISOString()
  });
};

const globalErrorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;
    error.status = err.status;
    error.details = err.details;
    error.isOperational = err.isOperational;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

module.exports = {
  AppError,
  globalErrorHandler
};
