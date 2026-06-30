const Joi = require('joi');
const { paginationAndOrder } = require('./pagination.validation');
const { uuid, orderString, optionalUuid } = require('./custom.validation');

const find = {
  query: Joi.object().keys({
    ...paginationAndOrder,
    date: Joi.string().isoDate(),
    dateFrom: Joi.string().isoDate(),
    dateTo: Joi.string().isoDate(),
    number: Joi.string().trim(),
    installmentDebtId: Joi.any().custom(optionalUuid),
    _order: Joi.string().custom(orderString)
  })
};

const create = {
  body: Joi.object().keys({
    date: Joi.string().isoDate().required(),
    amount: Joi.number().precision(2).min(0).required(),
    number: Joi.string().trim().required(),
    installmentDebtId: Joi.string().custom(uuid).required(),
    debtorId: Joi.string().custom(uuid).required(),
    debtPaymentId: Joi.any().custom(optionalUuid)
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
    number: Joi.string().trim(),
    installmentDebtId: Joi.string().custom(uuid),
    debtorId: Joi.string().custom(uuid),
    debtPaymentId: Joi.any().custom(optionalUuid)
  }).min(1)
};

const destroy = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  })
};

const payInstallment = {
  params: Joi.object().keys({
    id: Joi.string().custom(uuid).required()
  }),
  body: Joi.object().keys({
    amount: Joi.number().precision(2).min(0),
    date: Joi.string().isoDate(),
    description: Joi.string().trim()
  })
};

module.exports = {
  find,
  create,
  findById,
  update,
  destroy,
  payInstallment
};
