const express = require('express');

const expenseRoute = require('./expense.route.js');
const incomeRoute = require('./income.route.js');
const incomeTypeRoute = require('./incomeType.route.js');
const paymentMethodRoute = require('./paymentMethod.route.js');
const subtypeRoute = require('./subtype.route.js');
const typeRoute = require('./type.route.js');
const userRoute = require('./user.route.js');
const personRoute = require('./person.route.js');
const groupRoute = require('./group.route.js');
const monthlyBudgetRoute = require('./monthlyBudget.route.js');
const budgetRoute = require('./budget.route.js');
const shoppingRoute = require('./shopping.route.js');
const quotaRoute = require('./quota.route.js');
const debtorRoute = require('./debtor.route.js');
const debtRoute = require('./debt.route.js');
const debtPaymentRoute = require('./debtPayment.route.js');
const installmentDebtRoute = require('./installmentDebt.route.js');
const installmentDebtDetailRoute = require('./installmentDebtDetail.route.js');
const healthRoute = require('./health.js');
const router = express.Router();

// Rutas principales
router.use('/expenses', expenseRoute);
router.use('/incomes', incomeRoute);
router.use('/income-types', incomeTypeRoute);
router.use('/payment-methods', paymentMethodRoute);
router.use('/subtypes', subtypeRoute);
router.use('/types', typeRoute);
router.use('/users', userRoute);
router.use('/persons', personRoute);
router.use('/groups', groupRoute);
router.use('/monthly-budgets', monthlyBudgetRoute);
router.use('/budgets', budgetRoute);
router.use('/shoppings', shoppingRoute);
router.use('/quotas', quotaRoute);
router.use('/debtors', debtorRoute);
router.use('/debts', debtRoute);
router.use('/debt-payments', debtPaymentRoute);
router.use('/installment-debts', installmentDebtRoute);
router.use('/installment-debt-details', installmentDebtDetailRoute);
router.use('/health', healthRoute);


module.exports = router;
