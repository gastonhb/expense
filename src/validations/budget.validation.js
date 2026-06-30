const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString, optionalUuid } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.string().isoDate(),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};

const create = {
  body: Joi.object().keys({
    date: Joi.string().isoDate().required(),
    amount: Joi.number().precision(2).min(0).required(),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    monthlyBudgetId: Joi.any().custom(optionalUuid).required(),
    description: Joi.string().trim().allow(''),
    paid: Joi.boolean()
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
    date: Joi.string().isoDate(),
    amount: Joi.number().precision(2).min(0),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    monthlyBudgetId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim().allow(''),
    paid: Joi.boolean()
  }).min(1)
};

const destroy = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  })
};

const payBudget = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  }),
  body: Joi.object().keys({
    amount: Joi.number().precision(2).min(0),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    paymentMethodId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim()
  })
};

module.exports = {
  find,
  create,
  findById,
  update,
  destroy,
  payBudget
};
