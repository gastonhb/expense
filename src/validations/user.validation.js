const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    name: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().trim().lowercase().email(),
    authenticationId: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};

const baseBodySchema = {
  name: Joi.string().trim(),
  lastName: Joi.string().trim(),
  email: Joi.string().trim().lowercase().email(),
  authenticationId: Joi.string().trim()
};

const create = {
  body: Joi.object().keys({
    name: baseBodySchema.name.required(),
    lastName: baseBodySchema.lastName.required(),
    email: baseBodySchema.email.required(),
    authenticationId: baseBodySchema.authenticationId.required()
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
  body: Joi.object().keys(baseBodySchema).min(1)
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
