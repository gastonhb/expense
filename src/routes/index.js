const express = require('express');

const testRoute = require('./test.route.js');
const healthRoute = require('./health.js');
const router = express.Router();

// Rutas principales
router.use('/tests', testRoute);
router.use('/health', healthRoute);

module.exports = router;
