const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.string().isoDate(),
    _order: Joi.string().custom(orderString)
  })
};

const create = {
  body: Joi.object().keys({
    date: Joi.string().isoDate().required()
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
    date: Joi.date()
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
