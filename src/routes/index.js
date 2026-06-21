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
router.use('/health', healthRoute);


module.exports = router;
