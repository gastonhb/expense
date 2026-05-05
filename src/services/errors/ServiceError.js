class ServiceError extends Error {
  constructor(message, statusCode = 500, code = 'SERVICE_ERROR') {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ServiceError;
