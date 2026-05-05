const ServiceError = require('./ServiceError');

class NotFoundServiceError extends ServiceError {
  constructor(resource = 'Recurso', id = null) {
    const message = id
      ? `${resource} con ID '${id}' no encontrado`
      : `${resource} no encontrado`;

    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundServiceError';
    this.resource = resource;
    this.id = id;
  }
}

module.exports = NotFoundServiceError;
