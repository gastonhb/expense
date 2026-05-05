const Joi = require('joi');
const { paginationAndOrder }  = require('./pagination.validation');
const { uuid } = require('./custom.validation');

// Validación personalizada para ordenamiento
const orderValidation = Joi.string().custom((value, helpers) => {
  const allowedFields = ['name', 'createdAt', 'updatedAt'];
  const sortFields = value.split(',').map(field => field.trim());

  for (const field of sortFields) {
    const fieldName = field.startsWith('-') ? field.substring(1) : field;
    if (!allowedFields.includes(fieldName)) {
      return helpers.error('any.invalid', {
        message: `Campo de ordenamiento no válido: ${fieldName}. Campos permitidos: ${allowedFields.join(', ')}`
      });
    }
  }

  return value;
});

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    name: Joi.string(),
    _order: orderValidation
  })
};

const create = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const findById = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  })
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  }),
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const destroy = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  })
};


module.exports = {
  find,
  create,
  findById,
  update,
  destroy
};
