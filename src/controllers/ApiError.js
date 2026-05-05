const { AppError } = require('../middlewares/errorHandler');

// Mantener compatibilidad con el código existente
// ApiError ahora usa la nueva clase AppError con más funcionalidades
class ApiError extends AppError {
  constructor(statusCode, message, details = null) {
    super(message, statusCode);
    this.details = details;
  }
}

module.exports = ApiError;
