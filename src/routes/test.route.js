const express = require('express');
const router = express.Router();
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const validate = require('../middlewares/validate');
const { apiLimiter, createLimiter } = require('../middlewares/rateLimiter');

const { testController: controller } = require('../controllers');
const { testValidation: validation } = require('../validations');

// Aplicar rate limiting general
router.use(apiLimiter);

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Operaciones CRUD para tests
 */

router.route('/')
  .get(validate(validation.find), controller.find)
  .post(createLimiter, validate(validation.create), controller.create)
  .all(methodNotAllowed);

router.route('/:id')
  .get(validate(validation.findById), controller.findById)
  .patch(validate(validation.update), controller.update)
  .delete(validate(validation.destroy), controller.delete)
  .all(methodNotAllowed);

module.exports = router;
