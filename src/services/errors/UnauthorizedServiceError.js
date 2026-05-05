const ServiceError = require('./ServiceError');

class UnauthorizedServiceError extends ServiceError {
  constructor(message = 'Acceso no autorizado', action = null) {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedServiceError';
    this.action = action;
  }
}

module.exports = UnauthorizedServiceError;
