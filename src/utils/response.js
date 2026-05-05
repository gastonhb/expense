const { HTTP_STATUS } = require('./constants');

class ResponseHelper {
  /**
   * Respuesta exitosa estándar
   */
  static success(res, data, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json(data);
  }

  /**
   * Respuesta de error estándar
   */
  static error(res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    return res.status(statusCode).json({
      message,
      errors
    });
  }

  /**
   * Respuesta paginada
   */
  static paginated(res, paginationResult, links) {
    return res.status(HTTP_STATUS.OK).json({
      count: paginationResult.count,
      results: paginationResult.results,
      links
    });
  }

  /**
   * Respuesta de creación exitosa
   */
  static created(res, data) {
    return res.status(201).json(data);
  }

  /**
   * Respuesta de actualización exitosa
   */
  static updated(res, data) {
    return res.status(200).json(data);
  }

  /**
   * Respuesta de eliminación exitosa
   */
  static deleted(res) {
    return res.status(204).end();
  }

  /**
   * Respuesta de no encontrado
   */
  static notFound(res, message = 'Recurso no encontrado') {
    return res.status(404).json({
      message,
      data: null
    });
  }

  /**
   * Respuesta de no autorizado
   */
  static unauthorized(res, message = 'No autorizado') {
    return res.status(401).json({
      status: 'error',
      message,
      data: null
    });
  }

  /**
   * Respuesta de prohibido
   */
  static forbidden(res, message = 'Acceso prohibido') {
    return res.status(403).json({
      status: 'error',
      message,
      data: null
    });
  }

  /**
   * Respuesta de validación
   */
  static validationError(res, errors, message = 'Error de validación') {
    return res.status(422).json({
      status: 'error',
      message,
      errors
    });
  }
}

module.exports = ResponseHelper;
