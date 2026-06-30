const express = require('express');
const router = express.Router();
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { apiLimiter, createLimiter } = require('../middlewares/rateLimiter');

const { incomeTypeController: controller } = require('../controllers');
const { incomeTypeValidation: validation } = require('../validations');

router.use(apiLimiter);
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Income Types
 *   description: Operaciones CRUD para tipos de ingresos
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
