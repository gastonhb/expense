const Database = require('../config/database');

const Person = require('./person.model')(Database.getSequelize());
const Group = require('./group.model')(Database.getSequelize());
const PersonGroup = require('./personGroup.model')(Database.getSequelize());

const User = require('./user.model')(Database.getSequelize());
const Type = require('./type.model')(Database.getSequelize());
const Subtype = require('./subtype.model')(Database.getSequelize());
const PaymentMethod = require('./paymentMethod.model')(Database.getSequelize());
const Expense = require('./expense.model')(Database.getSequelize());

const IncomeType = require('./incomeType.model')(Database.getSequelize());
const Income = require('./income.model')(Database.getSequelize());

const MonthlyBudget = require('./monthlyBudget.model')(Database.getSequelize());
const Budget = require('./budget.model')(Database.getSequelize());

const Shopping = require('./shopping.model')(Database.getSequelize());
const Quota = require('./quota.model')(Database.getSequelize());

const Debtor = require('./debtor.model')(Database.getSequelize());
const Debt = require('./debt.model')(Database.getSequelize());
const DebtPayment = require('./debtPayment.model')(Database.getSequelize());
const InstallmentDebt = require('./installmentDebt.model')(Database.getSequelize());
const InstallmentDebtDetail = require('./installmentDebtDetail.model')(Database.getSequelize());


const models = {
  User,
  Type,
  Subtype,
  PaymentMethod,
  Expense,
  Income,
  IncomeType,
  Person,
  Group,
  PersonGroup,
  MonthlyBudget,
  Budget,
  Shopping,
  Quota,
  Debtor,
  Debt,
  DebtPayment,
  InstallmentDebt,
  InstallmentDebtDetail
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;
