const express = require('express');
const router = express.Router();
const methodNotAllowed = require('../middlewares/methodNotAllowed');
const validate = require('../middlewares/validate');
const { apiLimiter, createLimiter } = require('../middlewares/rateLimiter');

const { personController: controller } = require('../controllers');
const { personValidation: validation } = require('../validations');

router.use(apiLimiter);

/**
 * @swagger
 * tags:
 *   name: Persons
 *   description: Operaciones CRUD para personas
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
