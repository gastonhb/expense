const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString, optionalUuid } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.string().isoDate(),
    dateFrom: Joi.string().isoDate(),
    dateTo: Joi.string().isoDate(),
    dueDate: Joi.string().isoDate(),
    dueDateFrom: Joi.string().isoDate(),
    dueDateTo: Joi.string().isoDate(),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};

const create = {
  body: Joi.object().keys({
    date: Joi.string().isoDate().required(),
    dueDate: Joi.string().isoDate().required(),
    amount: Joi.number().precision(2).min(0).required(),
    quotasCount: Joi.number().integer().min(1).required(),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
    description: Joi.string().trim().allow('').required()
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
    dueDate: Joi.string().isoDate(),
    amount: Joi.number().precision(2).min(0),
    quotasCount: Joi.number().integer().min(1),
    typeId: Joi.any().custom(optionalUuid),
    subtypeId: Joi.any().custom(optionalUuid),
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
