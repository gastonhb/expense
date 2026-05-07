const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.date().iso(),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
    paymentMethodId: Joi.string().custom(uuid),
    typeId: Joi.string().custom(uuid),
    subtypeId: Joi.string().custom(uuid),
    description: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};

const baseBodySchema = {
  date: Joi.date().iso(),
  amount: Joi.number().precision(2).min(0),
  paymentMethodId: Joi.string().custom(uuid).allow(null),
  typeId: Joi.string().custom(uuid).allow(null),
  subtypeId: Joi.string().custom(uuid).allow(null),
  description: Joi.string().trim()
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
