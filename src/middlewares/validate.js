const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../controllers/ApiError');
const logger = require('../config/logger');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, err } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object, {
      abortEarly: false
    });

  if (err) {
    const details = err.details.map((error) => (
      {
        code: '400',
        name: error.context.label,
        message: error.type === 'custom' ? error.message : error.type
      }));

    logger.warn('Error de validación', {
      url: req.url,
      method: req.method,
      validationErrors: details,
      requestData: object
    });

    return next(new ApiError(httpStatus.BAD_REQUEST, 'validationError', details));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
