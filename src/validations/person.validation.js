const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    name: Joi.string().trim(),
    lastName: Joi.string().trim(),
    _order: Joi.string().custom(orderString)
  })
};

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    userId: Joi.string().custom(uuid)
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
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    userId: Joi.string().custom(uuid)
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
