const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString, optionalUuid } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.date().iso(),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
    incomeTypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};


const create = {
  body: Joi.object().keys({
    date: Joi.date().iso().required(),
    amount: Joi.number().precision(2).min(0).required(),
    incomeTypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim().allow('')
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
    date: Joi.date().iso(),
    amount: Joi.number().precision(2).min(0).required(),
    incomeTypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim().allow('')
  }).min(1)
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
