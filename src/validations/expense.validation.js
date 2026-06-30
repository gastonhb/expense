const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString, optionalUuid } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.string().isoDate(),
    dateFrom: Joi.string().isoDate(),
    dateTo: Joi.string().isoDate(),
    paymentMethodId: Joi.any().custom(optionalUuid),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};

const baseBodySchema = {
  date: Joi.string().isoDate(),
  amount: Joi.number().precision(2).min(0),
  paymentMethodId: Joi.any().custom(optionalUuid),
  typeId: Joi.any().custom(optionalUuid),
  subtypeId: Joi.any().custom(optionalUuid),
  description: Joi.string().trim().allow('')
};

const create = {
  body: Joi.object().keys({
    date: baseBodySchema.date.required(),
    amount: baseBodySchema.amount.required(),
    paymentMethodId: baseBodySchema.paymentMethodId,
    typeId: baseBodySchema.typeId,
    subtypeId: baseBodySchema.subtypeId,
    description: baseBodySchema.description.required()
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
