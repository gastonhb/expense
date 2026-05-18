const Database = require('../config/database');

const User = require('./user.model')(Database.getSequelize());
const Type = require('./type.model')(Database.getSequelize());
const Subtype = require('./subtype.model')(Database.getSequelize());
const PaymentMethod = require('./paymentMethod.model')(Database.getSequelize());
const Expense = require('./expense.model')(Database.getSequelize());

const models = {
  User,
  Type,
  Subtype,
  PaymentMethod,
  Expense
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;
