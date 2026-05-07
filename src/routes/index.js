const express = require('express');

const expenseRoute = require('./expense.route.js');
const paymentMethodRoute = require('./paymentMethod.route.js');
const subtypeRoute = require('./subtype.route.js');
const typeRoute = require('./type.route.js');
const healthRoute = require('./health.js');
const router = express.Router();

// Rutas principales
router.use('/expenses', expenseRoute);
router.use('/payment-methods', paymentMethodRoute);
router.use('/subtypes', subtypeRoute);
router.use('/types', typeRoute);
router.use('/health', healthRoute);

module.exports = router;
