const Joi = require('joi');
const { pageAttr, limitAttr, orderAttr } = require('../config/pagination.js');

const pagination = {
  [limitAttr]: Joi.number().integer(),
  [pageAttr]: Joi.number().integer()
};

const order = {
  [orderAttr]: Joi.string()
};

const paginationAndOrder = {
  ...pagination,
  ...order
};

module.exports = {
  pagination,
  order,
  paginationAndOrder
};
